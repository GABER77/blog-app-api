'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">blog-app-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-cecf6f2737f1e6d59331d7ab6f71a8413cd64cb38b552b69b8a633f0a6fced3f13cc3d3f23afa816b2657a510028404c80833f7151d3c502da2440121a094628"' : 'data-bs-target="#xs-controllers-links-module-AppModule-cecf6f2737f1e6d59331d7ab6f71a8413cd64cb38b552b69b8a633f0a6fced3f13cc3d3f23afa816b2657a510028404c80833f7151d3c502da2440121a094628"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-cecf6f2737f1e6d59331d7ab6f71a8413cd64cb38b552b69b8a633f0a6fced3f13cc3d3f23afa816b2657a510028404c80833f7151d3c502da2440121a094628"' :
                                            'id="xs-controllers-links-module-AppModule-cecf6f2737f1e6d59331d7ab6f71a8413cd64cb38b552b69b8a633f0a6fced3f13cc3d3f23afa816b2657a510028404c80833f7151d3c502da2440121a094628"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-cecf6f2737f1e6d59331d7ab6f71a8413cd64cb38b552b69b8a633f0a6fced3f13cc3d3f23afa816b2657a510028404c80833f7151d3c502da2440121a094628"' : 'data-bs-target="#xs-injectables-links-module-AppModule-cecf6f2737f1e6d59331d7ab6f71a8413cd64cb38b552b69b8a633f0a6fced3f13cc3d3f23afa816b2657a510028404c80833f7151d3c502da2440121a094628"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-cecf6f2737f1e6d59331d7ab6f71a8413cd64cb38b552b69b8a633f0a6fced3f13cc3d3f23afa816b2657a510028404c80833f7151d3c502da2440121a094628"' :
                                        'id="xs-injectables-links-module-AppModule-cecf6f2737f1e6d59331d7ab6f71a8413cd64cb38b552b69b8a633f0a6fced3f13cc3d3f23afa816b2657a510028404c80833f7151d3c502da2440121a094628"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-67dfcc6e50610d202de0f91a1a2928ae544d0bc2adb106578e58a067f089a9a4f78cf5a9b6ee14b8c7fa61b9ccda74581268b1e2c35ca16ccb0cfc873f2b745a"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-67dfcc6e50610d202de0f91a1a2928ae544d0bc2adb106578e58a067f089a9a4f78cf5a9b6ee14b8c7fa61b9ccda74581268b1e2c35ca16ccb0cfc873f2b745a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-67dfcc6e50610d202de0f91a1a2928ae544d0bc2adb106578e58a067f089a9a4f78cf5a9b6ee14b8c7fa61b9ccda74581268b1e2c35ca16ccb0cfc873f2b745a"' :
                                            'id="xs-controllers-links-module-AuthModule-67dfcc6e50610d202de0f91a1a2928ae544d0bc2adb106578e58a067f089a9a4f78cf5a9b6ee14b8c7fa61b9ccda74581268b1e2c35ca16ccb0cfc873f2b745a"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-67dfcc6e50610d202de0f91a1a2928ae544d0bc2adb106578e58a067f089a9a4f78cf5a9b6ee14b8c7fa61b9ccda74581268b1e2c35ca16ccb0cfc873f2b745a"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-67dfcc6e50610d202de0f91a1a2928ae544d0bc2adb106578e58a067f089a9a4f78cf5a9b6ee14b8c7fa61b9ccda74581268b1e2c35ca16ccb0cfc873f2b745a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-67dfcc6e50610d202de0f91a1a2928ae544d0bc2adb106578e58a067f089a9a4f78cf5a9b6ee14b8c7fa61b9ccda74581268b1e2c35ca16ccb0cfc873f2b745a"' :
                                        'id="xs-injectables-links-module-AuthModule-67dfcc6e50610d202de0f91a1a2928ae544d0bc2adb106578e58a067f089a9a4f78cf5a9b6ee14b8c7fa61b9ccda74581268b1e2c35ca16ccb0cfc873f2b745a"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PostsModule.html" data-type="entity-link" >PostsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PostsModule-ef822bbe0147ab6606ec54668150f05c36f901de2e89d9a207cfdb87076735db442cb05e5660a1da99dca7a1aa96134ee7e0db8bd1d76548836761d687b0aa9b"' : 'data-bs-target="#xs-controllers-links-module-PostsModule-ef822bbe0147ab6606ec54668150f05c36f901de2e89d9a207cfdb87076735db442cb05e5660a1da99dca7a1aa96134ee7e0db8bd1d76548836761d687b0aa9b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PostsModule-ef822bbe0147ab6606ec54668150f05c36f901de2e89d9a207cfdb87076735db442cb05e5660a1da99dca7a1aa96134ee7e0db8bd1d76548836761d687b0aa9b"' :
                                            'id="xs-controllers-links-module-PostsModule-ef822bbe0147ab6606ec54668150f05c36f901de2e89d9a207cfdb87076735db442cb05e5660a1da99dca7a1aa96134ee7e0db8bd1d76548836761d687b0aa9b"' }>
                                            <li class="link">
                                                <a href="controllers/PostsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PostsModule-ef822bbe0147ab6606ec54668150f05c36f901de2e89d9a207cfdb87076735db442cb05e5660a1da99dca7a1aa96134ee7e0db8bd1d76548836761d687b0aa9b"' : 'data-bs-target="#xs-injectables-links-module-PostsModule-ef822bbe0147ab6606ec54668150f05c36f901de2e89d9a207cfdb87076735db442cb05e5660a1da99dca7a1aa96134ee7e0db8bd1d76548836761d687b0aa9b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PostsModule-ef822bbe0147ab6606ec54668150f05c36f901de2e89d9a207cfdb87076735db442cb05e5660a1da99dca7a1aa96134ee7e0db8bd1d76548836761d687b0aa9b"' :
                                        'id="xs-injectables-links-module-PostsModule-ef822bbe0147ab6606ec54668150f05c36f901de2e89d9a207cfdb87076735db442cb05e5660a1da99dca7a1aa96134ee7e0db8bd1d76548836761d687b0aa9b"' }>
                                        <li class="link">
                                            <a href="injectables/PostsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-bb91480f981214a078b472c8ee0249c72ecaec8a94923e54352da6fb7dcbf10ccc8608d085d60ebe761047e3987cb078ee71c3bfab7bd7579ad6d087b9afb003"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-bb91480f981214a078b472c8ee0249c72ecaec8a94923e54352da6fb7dcbf10ccc8608d085d60ebe761047e3987cb078ee71c3bfab7bd7579ad6d087b9afb003"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-bb91480f981214a078b472c8ee0249c72ecaec8a94923e54352da6fb7dcbf10ccc8608d085d60ebe761047e3987cb078ee71c3bfab7bd7579ad6d087b9afb003"' :
                                            'id="xs-controllers-links-module-UsersModule-bb91480f981214a078b472c8ee0249c72ecaec8a94923e54352da6fb7dcbf10ccc8608d085d60ebe761047e3987cb078ee71c3bfab7bd7579ad6d087b9afb003"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-bb91480f981214a078b472c8ee0249c72ecaec8a94923e54352da6fb7dcbf10ccc8608d085d60ebe761047e3987cb078ee71c3bfab7bd7579ad6d087b9afb003"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-bb91480f981214a078b472c8ee0249c72ecaec8a94923e54352da6fb7dcbf10ccc8608d085d60ebe761047e3987cb078ee71c3bfab7bd7579ad6d087b9afb003"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-bb91480f981214a078b472c8ee0249c72ecaec8a94923e54352da6fb7dcbf10ccc8608d085d60ebe761047e3987cb078ee71c3bfab7bd7579ad6d087b9afb003"' :
                                        'id="xs-injectables-links-module-UsersModule-bb91480f981214a078b472c8ee0249c72ecaec8a94923e54352da6fb7dcbf10ccc8608d085d60ebe761047e3987cb078ee71c3bfab7bd7579ad6d087b9afb003"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PostsController.html" data-type="entity-link" >PostsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreatePostDto.html" data-type="entity-link" >CreatePostDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePostMetaOptonsDto.html" data-type="entity-link" >CreatePostMetaOptonsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserParamDto.html" data-type="entity-link" >GetUserParamDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PatchUserDto.html" data-type="entity-link" >PatchUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePostDto.html" data-type="entity-link" >UpdatePostDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostsService.html" data-type="entity-link" >PostsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});