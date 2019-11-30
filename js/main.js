(function($){

    lazyLoadImages();
    prepPortfolioWidget($(window));
    
    // ==========
    // Variables
    // ==========
    
    // Used to enable or disable certain development-only functionality.  Change this to false in a production environment.
    var ENV_DEV = true;
    
    // Global variable used to store a reference to the most recent timeout event.
    var searchThread = null;
    
    
    // ==========
    // Event Bindings
    // ==========
    
    
    // Lifecycle Events
    // ===
    
    // When the page loads...
    $(window).on('load', function(){
    
        // console.log('Ready.');
    
        var theWindow = $(window);
    
        if($('body').hasClass('show-contact-prompt')){
    
            setTimeout(function(){
    
                triggerContactPrompt();
    
            }, 2000);
        }
    
        // Initialize the clipboard functions.
        new ClipboardJS('.clipboard');
    
        // Handle the event.
        prepProcessSections();
        selectDynamicPageContent();
        // prepPortfolioWidget(theWindow);
        onScreenStateChange(theWindow);
    });
    
    // When the screen is resized (for some reason)...
    $(window).on('resize', function(){
    
        var theWindow = $(this);
    
        // Log the new window size.
        // console.log('Window resize: ' + theWindow.outerWidth() + ' by ' + theWindow.outerHeight());
    
        onScreenStateChange(theWindow);
    });
    
    
    // Click Events
    // ===
    
    var conversationIndex = 0;
    var conversationInterval;
    var conversationStrings = ['Still hovering over that button, eh?',
                            'Do you know how hard it is for a button to float like this??',
                            'I double-dog dare you to click the button.  Yeah&hellip;I wen\'t there.',
                            'Just click it, you know you want to&hellip;',
                            'Ugh! Such a tease.',
                            'Okay, okay, you win &mdash; I\'ll stop bugging you.',
                            '&hellip;you sure you don\'t want to just click it though?'];
    
    $('#homepage-cta-button a.btn').hover(function(event){
    
        // console.log(conversationIndex);
    
        $('#homepage-cta-button p.cta-hover-text').addClass('active');
        startCyclingConversation();
    
    }, function(event){
    
        $('#homepage-cta-button p.cta-hover-text').removeClass('active');
        stopCyclingConversation();
    });
    
    function startCyclingConversation(){
    
        conversationIndex = 0;
        conversationInterval = setInterval(function(){
    
            $('#homepage-cta-button p.cta-hover-text').html(conversationStrings[conversationIndex]);
            conversationIndex++;
    
        }, 4000);
    }
    
    function stopCyclingConversation(){
    
        conversationIndex = 0;
        clearInterval(conversationInterval);
        var hoverTextElem = $('#homepage-cta-button p.cta-hover-text');
    
        // console.log('Stopping cycling now: ' + hoverTextElem.data('src'));
    
        hoverTextElem.html(hoverTextElem.data('src'));
    }
    
    $('.portfolio-preview-toggle').click(function(event){
    
        event.preventDefault();
    
        $('#portfolio-preview-fullscreen').addClass('active');
    
        // Hide the submenu if it is showing.
        $('.sub-menu.show').removeClass('show');
        toggleBodyScroll();
    
        $('#contact-widget').css('display', 'none');
        $('nav.navbar').css('display', 'none');
    
    });
    
    $('#portfolio-preview-fullscreen a.kbs-close, #portfolio-preview-fullscreen .close-capture').click(function(event){
    
        event.preventDefault();
    
        $('#portfolio-preview-fullscreen').removeClass('active');
        toggleBodyScroll();
    
        $('#contact-widget').css('display', 'block');
        $('nav.navbar').css('display', 'block');
    });
    
    
    $('.clipboard').click(function(event){
    
        event.preventDefault();
    
        if($(this).find('span.callout').length){
    
            var callout = $(this).find('span.callout');
    
            callout.addClass('active');
    
            setTimeout(function(){
    
                callout.removeClass('active');
    
            }, 2000);
        }
    });
    
    // When a scroll link is clicked...
    $('.scroll-link').click(function(event){
    
        event.preventDefault();
    
        doScroll($(this).attr('href'));
    });
    
    // When the toggler is clicked...
    $('#contact-widget a.cw-item.cw-toggler').click(function(event){
    
        event.preventDefault();
    
        // If the popover was active already, remove it.
        if($(this).hasClass('popover-active')){
    
            $(this).removeClass('popover-active');
        }
        
        $('#contact-widget').toggleClass('active');
    });
    
    var menuHoverTimeout;
    
    // Dropdown menu functionality.
    $('body:not(.show-menu) .menu-item-has-children').mouseenter(function(event){
    
        // event.preventDefault();
    
        // Instead, target the <li>.
    
        // console.log('MOUSE ENTER');
    
        // If the menu is showing, do not add the class on mouse enter (it is handled on click instead).
        if(!$('body').hasClass('show-menu')){
    
            $(this).addClass('show');
            $(this).find('.sub-menu').addClass('show');
        }
    });
    
    $('body:not(.show-menu) .menu-item-has-children > a::after').mouseenter(function(event){
    
        // console.log('test');
    });
    
    // $('.menu-item-has-children > a::after').mouseenter(function(event){
    
    // 	// If the menu is showing, do not add the class on mouse enter (it is handled on click instead).
    // 	if(!$('body').hasClass('show-menu')){
    
    // 		$(this).parent().addClass('show');
    // 		$(this).parent().find('.sub-menu').addClass('show');
    // 	}
    // });
    
    $('body:not(.show-menu) .menu-item-has-children').mouseleave(function(event){
    
        var menu = $(this);
    
        // console.log('MOUSE LEAVE');
    
        setMenuTimeout(menu);	
    });
    
    $('.menu-item-has-children > a').click(function(event){
    
        event.preventDefault();
    
        // console.log('CLICK');
    
        $(this).parent().toggleClass('show');
        $(this).parent().find('.sub-menu').toggleClass('show');
    });
    
    $('.sub-menu, .sub-menu::before').mouseenter(function(event){
    
        // console.log('MOUSE ENTER 2');
    
        clearMenuTimeout();
    });
    
    $('.sub-menu').mouseleave(function(event){
    
        // console.log('MOUSE LEAVE 2');
    
        setMenuTimeout($(this).parent().find('>a'));
    });
    
    function clearMenuTimeout(){
    
        clearTimeout(menuHoverTimeout);
    }
    
    function setMenuTimeout(menu){
    
        // First, clear the timeout.
        clearTimeout(menuHoverTimeout);
    
        menuHoverTimeout = setTimeout(function(){
    
            menu.removeClass('show');
            menu.find('.sub-menu').removeClass('show');
            // console.log('Removing \'show\'');
    
        }, 120);
    }
    
    // When any contact item is hovered over...
    $('#contact-widget a.cw-item:not(.cw-toggler)').hover(function(event){
    
        if($(this).find('span.callout').length){
    
            $(this).find('span.callout').toggleClass('active');
        }
    });
    
    // Mobile menu button.
    $('.navbar-toggler').click(function(){
    
        $('body').toggleClass('show-menu');
        toggleBodyScroll();
    });
    
    // Mobile menu close button.
    $('#nav-close').click(function(){
    
        // Just link to the primary Bootstrap toggler.
        $('.navbar-toggler').click();
    });
    
    // Primary contact form submit button is hovered.
    $('#primary-form button').hover(function(){
    
        $('.follow-up-reminder').addClass('active');
    
    }, function(){
    
    
        $('.follow-up-reminder').removeClass('active');
    });
    
    
    // When the forward control is clicked.
    $('#pw-controls .forward').click(function(event){
    
        event.preventDefault();
    
        adjustPortfolioIndex($('#portfolio-widget'), 1);
    });
    
    // When the backward control is clicked.
    $('#pw-controls .backward').click(function(event){
    
        event.preventDefault();
    
        adjustPortfolioIndex($('#portfolio-widget'), -1);
    });
    
    
    // When a process item is hovered.
    $('.process-item').hover(function(){
    
        var target = $(this).data('target');
    
        $('.process-item').each(function(){
    
            $(this).removeClass('active');
        });
    
        $('.illustration').each(function(){
    
            $(this).removeClass('active');
        });
    
        $('body.home #process video').each(function(){
    
            $(this).get(0).pause();
        });
    
        // console.log(target);
    
        $(this).addClass('active');
        $('#' + target).addClass('active');
        // randomizeIcons($('#' + target));
    
    }, function(){
    
        // Do nothing.
    });
    
    
    // When an archive filter item is clicked.
    $('.archive-filter a').click(function(event){
    
        
        var parent = $(this).parent();
    
        // console.log('About to filter: ' + $(this).data('value'));
        // $.param('q', $(this).data('value'));
    
        // If the item is not already active...
        if(!parent.hasClass('selected')){
    
            // If the user did not click on the "All" button...
            if($(this).data('value') != 'all'){
    
                event.preventDefault();
    
                // Remove the selected class from whichever was selected.
                $('.archive-filter li.selected').removeClass('selected');
                parent.addClass('selected');
    
                updateFilterResults($(this).data('value'), $('.archive-filter ul').data('post-type'));
            }
    
            // Otherwise, default functionality is desirable.
        }
        else{
    
            event.preventDefault();
        }
    });
    
    $('.context-switcher li a').click(function(event){
    
        event.preventDefault();
    
        updatePageContext($(this).data('target'));
    });
    
    
    // Other Events
    // ===
    
    // When the window is scrolled...
    $(window).scroll(function(){
    
        var theWindow = $(this);
    
        // Log the new scrollTop.
        // console.log('Window scrolled: ' + theWindow.scrollTop());
    
        onScreenStateChange(theWindow);
    });
    
    // The fancy ROI calculator on the conversion blog.
    $('#blog-ltv').change(function(){
    
        doBlogCalculations();
    });
    
    $('#blog-traffic').change(function(){
    
        doBlogCalculations();
    });
    
    function doBlogCalculations(){
    
        // If the blog element is visible.
        if($('#blog-ltv').length){
    
            var ltv = $('#blog-ltv').val();
            var traffic = $('#blog-traffic').val();
    
            var onePercent = ltv * (traffic / 100);
    
            // console.log(ltv + ' / (' + traffic + ' / 100 ) = ' + onePercent);
    
            $('#blog-customer-number').html(onePercent);
        }
    }
    
    $('#archive-search').keyup(function(event){
    
        // Clear the previous timeout (if there is one).
          clearTimeout(searchThread);
    
          var $this = $(this); 
    
          // Save a reference to a timeout to be used.
          searchThread = setTimeout(function(){
    
            // Actaully update the search results (every 1/2 second).
            updateSearchResults($this.val(), $this.data('post-type'));
    
        }, 500);
    });
    
    // Used for text search.
    function updateSearchResults(query, postType){
    
        // console.log('About to query "' + query + '" for post type: ' + postType);
    
        if(query === ''){
    
            // Reset the pagination by simply refreshing the page.
            location.reload();
        }
        else{
    
            jQuery.ajax({
    
                type : 'post',
                url : myAjax.ajaxUrl,
                data : {
    
                    action : 'archive_filter_search',
                       post_type : postType,
                       query : query
                },
                beforeSend: function() {
    
                    // Prevent interaction for a brief moment.
                    $('.archive-container').addClass('disabled');
                },
                success : function( response ) {
    
                    // console.log('Response received: ' + response);
    
                    // Resume control, and output the results of the query into the HTML container.
                    $('.archive-container').removeClass('disabled');
                    $('.archive-container').html(response);
    
                    // TODO: Actually link this in with pagination.
                    if(query === ''){
    
                        // console.log('Resetting now.');
                        $('.pagination').removeClass('d-none');
                    }
                    else{
    
                        $('.pagination').addClass('d-none');
                    }
                }
            });
        }
    }
    
    // Used for tag search.
    function updateFilterResults(tag, postType){
    
        // console.log('About to filter by "' + tag + '" for post type: ' + postType);
    
        var allOverride = false;
    
        if(tag === 'all'){
    
            allOverride = true;
        }
    
        jQuery.ajax({
    
            type : 'post',
            url : myAjax.ajaxUrl,
            data : {
    
                action : 'archive_filter_tag',
                   post_type : postType,
                   tag : tag,
                   all_override: allOverride
            },
            beforeSend: function() {
    
                // Prevent interaction for a brief moment.
                $('.archive-container').addClass('disabled');
            },
            success : function( response ) {
    
                // console.log('Response received: ' + response);
                $('.pagination').addClass('disabled');
    
                // Resume control, and output the results of the query into the HTML container.
                $('.archive-container').removeClass('disabled');
                $('.archive-container').html(response);
    
                // Request that images are lazy loaded again.
                lazyLoadImages('.archive-container');
            }
        });
    }
    
    
    // When a key is pressed...
    $(window).keyup(function( event ) {
    
        // console.log(event.keyCode);
    
        // If the user presses "Escape".
        if(event.keyCode == 27) {
    
            // Used for testing purposes mostly.
            // triggerContactPrompt();
            // console.log('closing');
    
            // If the preview widget is active, close it.
            if($('#portfolio-preview-fullscreen').length){
    
                if($('#portfolio-preview-fullscreen').hasClass('active')){
    
                    $('#portfolio-preview-fullscreen').removeClass('active');
                    toggleBodyScroll();
                    $('#contact-widget').css('display', 'block');
                }
            }
        }
    });
    
    
    
    // ==========
    // Helper Functions
    // ==========
        
    // Lazy loads all the images on the page that are designated to load lazily.
    function lazyLoadImages(filter){
    
        // If the filter was not set, set it to the null string.
        if(filter === undefined){
    
            filter = '';
        }
    
        // console.log('Filter:' + filter);
    
        $(filter + ' .lazy-bg-with-filter').each(function(){
    
            var lazyLoadItem = $(this);
    
            $('<img/>').attr('src', lazyLoadItem.data('img-src')).on('load', function() {
    
               $(this).remove(); // prevent memory leaks as @benweet suggested
    
               // console.log('Adding background image to ' + lazyLoadItem);
               // Add active to the container class.
               // $('hero-bg').addClass('active');
    
               // Adds the special background gradient overlay.
               lazyLoadItem.css('background-image', 'linear-gradient( 135deg, rgba(221, 221, 221, 0.8) 10%, rgba(210, 32, 39, 0.8) 100%), url("' + lazyLoadItem.data('img-src') + '")');
               lazyLoadItem.addClass('active');
            });
        });
    
        // Load lazy background images.
        $(filter + ' .lazy-bg').each(function(){
    
            var lazyLoadItem = $(this);
    
            // var src = $(this).data('img-src');
            $('<img/>').attr('src', $(this).data('img-src')).on('load', function() {
    
               $(this).remove(); // prevent memory leaks as @benweet suggested
    
               // console.log('Adding background image to ' + lazyLoadItem);
               // Add active to the container class.
               // $('hero-bg').addClass('active');
    
               lazyLoadItem.css('background-image', 'url("' + lazyLoadItem.data('img-src') + '")');
               lazyLoadItem.addClass('active');
            });
        });
    
        // Load lazy images.
        $(filter + ' img.lazy').each(function(){
    
            var lazyLoadItem = $(this);
    
            // var src = $(this).data('img-src');
            $('<img/>').attr('src', $(this).data('img-src')).on('load', function() {
    
               $(this).remove(); // prevent memory leaks as @benweet suggested
    
               // console.log('Adding background image to ' + lazyLoadItem);
               // Add active to the container class.
               // $('hero-bg').addClass('active');
    
               lazyLoadItem.attr('src', lazyLoadItem.data('img-src'));
               lazyLoadItem.addClass('active');
            });
        });
    }
    
    function prepProcessSections(){
    
        if($('.process-item').length){
    
            // randomizeIcons($('#discovery'));
            // randomizeIcons($('#design'));
            // randomizeIcons($('#development'));
        }
    }
    
    // Randomizes the locations and sizes of the icon mosaics.
    function randomizeIcons(container){
    
        container.find(' span').each(function(){
    
            // $(this).html('LOL');
            // console.log($(this));
    
            var randomLeft = Math.random() * 90;
            var randomTop = Math.random() * 90;
    
            var randomSize = (Math.random() + .25) * 3;
    
            $(this).css('left', randomLeft + '%');
            $(this).css('top', randomTop + '%');
            $(this).css('transform', 'scale(' + randomSize + ')');
    
        });
    
        container.find('.icon-mosaic').addClass('active');
    }
    
    
    // Helper function that activates/pauses body scrolling.
    function toggleBodyScroll(){
    
        $('body').toggleClass('no-scroll');
    }
    
    
    // Simple helper function that re-renders components that are dependent
    // on the screen dimensions or scroll position
    function onScreenStateChange(theWindow){
    
        // console.log('screen state change');
    
        // Handle the event.
        handleScrollFadeContent(theWindow);
        handleParallaxContent(theWindow);
        handlePortfolioScroll(theWindow);
    }
    
    
    // Parallax Content Controller
    // ===
    function handleParallaxContent(theWindow){
    
        // TODO: Make this dynamic in that is listens to the 
        // top of the browser and only scrolls the background 
        // when it has past the top of the container.
        var scrollTop = theWindow.scrollTop();
    
        $('.parallax').each(function(){
    
            var speed = $(this).data('speed');
    
            $(this).css('background-position', '100% -' + Math.floor(scrollTop * speed) + 'px');
    
        });
    }
    
    function handlePortfolioScroll(theWindow){
    
        var scrollTop = theWindow.scrollTop();
    
        if($('#sticky-portfolio-preview.sticky').length){
    
            // console.log('stickyy');
    
            // Determine the current bottom of the sticky portfolio widget.
            var currentTop = $('#sticky-portfolio-preview').offset().top;
            var currentBottom = currentTop + $('#sticky-portfolio-preview').outerHeight();
    
            // Determine the new bottom after applying the scroll change.
            var newBottom = currentBottom - scrollTop;
    
            // If that bottom is smaller than the container bottom.
            var containerBottom = $('#sticky-portfolio-preview').parent().parent().offset().top + $('#sticky-portfolio-preview').parent().parent().outerHeight();
    
            // console.log('ScrollTop: ' + scrollTop);
            // console.log('CurrentTop: ' + currentTop);
    
    
    
            // Apply the change
    
    
            // console.log('Container Height: ' + $('#sticky-portfolio-preview').parent().outerHeight());
            // console.log('Current Top: ' + currentTop);
            // console.log('Current Bottom: ' + (currentBottom));
            // console.log('Container Bottom: ' + containerBottom);
    
            // Calculate new currentBottom.
            // var newBottom = currentBottom - (scrollTop - 250);
    
            // console.log('New Bottom: ' + newBottom);
            // console.log('scroll: ' + ((scrollTop - 250) + 400));
    
            // TODO: Parallax scroll the image itself.
            if((scrollTop + 700) <= containerBottom){
    
                // var percentScrolled = ((currentTop - 250) / (containerBottom - 400)) * 100; // TBD
                var percentScrolled = ((scrollTop) / containerBottom) * 100;
    
                // console.log('Percent: ' + percentScrolled);
    
                $('#sticky-portfolio-preview').css('transform', 'translateY(' + (scrollTop - 325) + 'px)');
    
                if($('#sticky-portfolio-preview').hasClass('scroll')){
    
                    $('#sticky-portfolio-preview .desktop').css('background-position', 'center ' + (percentScrolled / $('#sticky-portfolio-preview').data('desktop-scroll-speed')) + '%');
                    $('#sticky-portfolio-preview .mobile').css('background-position', 'center ' + (percentScrolled / $('#sticky-portfolio-preview').data('mobile-scroll-speed')) + '%');
                }
            }		
        }
    }
    
    
    
    
    // Portfolio Widget
    // ===
    
    function prepPortfolioWidget(theWindow){
    
        // Defer all image loading from page render.
        $('#portfolio-widget .pw-item').each(function(){
    
            var desktopImage = $(this).find('.pw-desktop-image');
            var mobileImage = $(this).find('.pw-mobile-image');
    
            var desktopImageUrl = desktopImage.data('image-source');
            var mobileImageUrl = mobileImage.data('image-source');
    
            desktopImage.css('background-image', 'url(\'' + desktopImageUrl + '\'');
            mobileImage.css('background-image', 'url(\'' + mobileImageUrl + '\'');
    
            $('<img/>').attr('src', desktopImageUrl).on('load', function() {
    
               $(this).remove(); // prevent memory leaks as @benweet suggested
    
               // console.log('LOADED!');
               // Add active to the container class.
               desktopImage.css('background-image', 'url(\'' + desktopImageUrl + '\'');
               desktopImage.addClass('active');
            });
    
            $('<img/>').attr('src', mobileImageUrl).on('load', function() {
    
               $(this).remove(); // prevent memory leaks as @benweet suggested
    
               // console.log('LOADED!');
               // Add active to the container class.
               mobileImage.css('background-image', 'url(\'' + mobileImageUrl + '\'');
    
               mobileImage.addClass('active');
    
            });
    
            // console.log(desktopImageUrl);
    
        }).promise().done(function(){
    
            // console.log('PW READY!');
    
            $('#portfolio-widget').addClass('active');
        });
    }
    
    function adjustPortfolioIndex(portfolio, delta){
    
        var currentIndex = portfolio.data('index');
        var size = portfolio.find('.pw-item').length;
    
        var newIndex = currentIndex + delta;
    
        if(newIndex < 0){
    
            newIndex = size - 1;
    
        } else if (newIndex >= size){
    
            newIndex = 0;
        }
    
        portfolio.data('index', newIndex);
    
        var current = $('.pw-item.active');
        var next = portfolio.find('.pw-item').eq(newIndex);
    
        current.removeClass('active');
        next.addClass('active');
    }
    
    // Helper function that helps to pull attention to the contact widget.
    function triggerContactPrompt(){
    
        $('#contact-widget .cw-toggler').addClass('popover-active');
    
        setTimeout(function(){
    
            $('#contact-widget .cw-toggler').removeClass('popover-active');
    
        }, 5000);
    }
    
    // Helper function to encapsulate all the sub-functions that need to re-render
    // content when a hash is in the URL
    function selectDynamicPageContent(){
    
        var url = window.location.href;
        var target = url.split('#')[1];
    
        // console.log(url);
        // console.log(target);
    
        updatePageContext(target);
    }
    
    // if the page switcher is being used, this will switch the content properly.
    function updatePageContext(target){
    
        if($('.context-switcher').length && $('.switcher-content[data-name="' + target +'"').length){
    
            $('.context-switcher li').removeClass('selected');
            $('.switcher-content').removeClass('active');
    
            $('.context-switcher li a[data-target="' + target +'"').parent().addClass('selected');	
            $('.switcher-content[data-name="' + target +'"').addClass('active');	
    
            // Update the hash for URL integrity.
            window.location.hash = target;
        }
    }
    
    
    // Scroll Fader
    // ===
    
    // Fades in content that is dependent on the window scroll value.
    function handleScrollFadeContent(theWindow){
    
        // var scrollBottom = scrollTop + $(window).outerHeight();
        var scrollMiddle = theWindow.scrollTop() + (theWindow.outerHeight() / 2)
    
        $('.scrollFade').each(function(){
    
            var elem = $(this);
            var elemTop = elem.offset().top;
            var elemHeight = elem.outerHeight();
            var elemMiddle = elemTop + (elemHeight / 2);
    
            var startAt = elem.data('fader-start');
            var effScrollMiddle = scrollMiddle + elem.data('fader-offset');
    
            var percentScrolledThrough = (effScrollMiddle >= elemTop) ? ((effScrollMiddle - elemTop) / (elemMiddle - elemTop)) : 0.0;
            var newOpacity = (percentScrolledThrough * (1 - startAt)) + startAt;
    
            // console.log('New Opacity: ' + newOpacity);
    
            if(newOpacity < 1.0){
    
                elem.css('opacity', newOpacity);
            }
            else{
    
                elem.css('opacity', 1.0);
            }
        });
    }
    
    
    
    // Scroll Links
    // ===
    
    // Scrolls the body to the passed target (a string selector with a # in front of it denoting the id of the target element).
    function doScroll(target){
    
        var targetElem = $('' + target);
    
        // If the target was found...
        if(targetElem.length){
    
            var destination = targetElem.offset().top - SCROLL_TOP_OFFSET;
    
            // Do the animation and focus the element (for screen readers).
            targetElem.focus();
            $('html, body').animate({scrollTop : destination}, 1000, 'swing');
        }
        else{
    
            // console.log('Target not found -- be sure to add the \'#\' before the target in the \'href\' attribute in the HTML.');
        }
    }
    })(jQuery);