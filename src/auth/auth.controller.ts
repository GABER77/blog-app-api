import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { RequestWithCookies } from './interfaces/auth-interfaces';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RequestWithUser } from './interfaces/auth-interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/upload/multer-options';
import {
  moveImageToFinalPath,
  uploadTempImage,
} from 'src/common/upload/upload.service';
import { UserService } from 'src/users/services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('signup')
  @UseInterceptors(FileInterceptor('profileImage', multerOptions))
  // when do swagger, mentions that the content type is multipart/form-data
  async signup(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    let tempKey: string | undefined;

    // If image is uploaded, upload it to temporary S3 path
    if (file) {
      try {
        // Store temporarily untill user ID is available
        tempKey = await uploadTempImage(file);
      } catch (err) {
        console.error('❌ Image upload failed:', err);
        throw new InternalServerErrorException('Failed to upload image');
      }
    }

    // Create the user and receive tokens and user object
    const result = await this.authService.signup(createUserDto);
    const { cookies, user } = result;

    // If image was uploaded earlier, move it to permanent path
    if (tempKey) {
      try {
        const finalUrl = await moveImageToFinalPath(tempKey, user.id);
        user.profileImage = finalUrl;
        // Update user.profileImage in DB
        await this.userService.updateUserImageUrl(user.id, finalUrl);
      } catch (err) {
        console.error('Image move failed:', err);
      }
    }

    // Set the access & refresh tokens as HTTP-only cookies
    res
      .cookie(
        cookies.accessTokenCookie.name,
        cookies.accessTokenCookie.value,
        cookies.accessTokenCookie.options,
      )
      .cookie(
        cookies.refreshTokenCookie.name,
        cookies.refreshTokenCookie.value,
        cookies.refreshTokenCookie.options,
      );
    return user;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Validate user and get back tokens and user object
    const result = await this.authService.login(loginDto);

    // If authentication fails, throw an UnauthorizedException
    if (!result) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const { cookies, user } = result;

    // Set the access & refresh tokens as HTTP-only cookies
    res
      .cookie(
        cookies.accessTokenCookie.name,
        cookies.accessTokenCookie.value,
        cookies.accessTokenCookie.options,
      )
      .cookie(
        cookies.refreshTokenCookie.name,
        cookies.refreshTokenCookie.value,
        cookies.refreshTokenCookie.options,
      );
    return user;
  }

  @Public()
  @Get('refresh-token')
  async refreshToken(@Req() req: RequestWithCookies, @Res() res: Response) {
    const accessToken = await this.authService.refreshToken(req);

    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(
          Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 60 * 1000,
        ),
      })
      .send({ message: 'Access token refreshed successfully.' });
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // Passport takes care of redirecting to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard) // This Guard calls your validate() method to build the user object and attach it to the request
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const { cookies } = await this.authService.googleLogin(req.user);
    res
      .cookie(
        cookies.accessTokenCookie.name,
        cookies.accessTokenCookie.value,
        cookies.accessTokenCookie.options,
      )
      .cookie(
        cookies.refreshTokenCookie.name,
        cookies.refreshTokenCookie.value,
        cookies.refreshTokenCookie.options,
      )
      .redirect(process.env.GOOGLE_SUCCESS_REDIRECT || '/');
  }
}
