var S123 = function() {
    var that = {};
    that.init = function() {
        S123.loadDeferCSS();
        S123.contextmMenuDisable();
        S123.addIE11SupportClass();
    };
    return that;
}();
S123.loadDeferCSS = function() {
    $(document).on('s123.page.load', function(event) {
        var $defer_css = $('.defer-css');
        $defer_css.each(function() {
            var $css = $(this);
            $css.attr('href', $css.attr('data-href'));
            $css.removeAttr('data-href');
        });
    });
};
S123.isWebsiteInSlidingWindow = function() {
    try {
        if (!window.frameElement) return false;
    } catch (e) {
        return false;
    }
    if (window.frameElement.id === 'pagePopupWinID_iFrame') return true;
}();
S123.inIframe = function() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}();
S123.addIE11SupportClass = function() {
    if (!IsIE11()) return;
    $('html').addClass('ie11-support');
};
S123.QueryString = (function(paramsArray) {
    let params = {};
    for (let i = 0; i < paramsArray.length; ++i) {
        let param = paramsArray[i]
            .split('=', 2);
        if (param.length !== 2)
            continue;
        params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
    }
    return params;
})(window.location.search.substr(1).split('&'));
S123.escapeHtml = function(text) {
    if (!text) return text;
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;'
    };
    return text.toString().replace(/[&<>"']/g, function(m) {
        return map[m];
    });
};
S123.contextmMenuDisable = function() {
    return;
    $('body').on('contextmenu', '.disable-context-menu', function() {
        return false;
    });
};
S123.objectAssign = function(target, sources) {
    if (Object.assign) {
        sources = Object.assign(target, sources);
    } else {
        for (var prop in target)
            if (!sources.hasOwnProperty(prop)) sources[prop] = target[prop];
    }
    return sources;
};
S123.s123IconToSvg = function() {
    var _ = {
        folderPath: '/ready_uploads/svg/'
    };
    _.init = function() {
        $(document).on('s123.page.ready.s123IconToSvg', function(event) {
            if (IsIE11()) {
                loadFiles();
                $('.s123-icon-converter').each(function() {
                    var $this = $(this);
                    var $newIcon = $(_.getHtml($this.data('icon-name'), $this.data('ie11-classes'), ''));
                    if ($this.closest('#top-menu-mobile').length > 0) {
                        var newElem = $('<span class="fa fa-' + $this.data('icon-name') + '">&nbsp;</span>');
                        $this.replaceWith(newElem);
                    } else {
                        if ($this.attr('style').indexOf('display') != -1) {
                            $newIcon.css({
                                display: $this.css('display')
                            });
                        }
                        $this.replaceWith($newIcon);
                    }
                });
            } else {
                _.handleFroalaIcons();
            }
        });
    };
    _.handleFroalaIcons = function() {
        loadFiles();
    };
    _.getHtml = function(icon, classes, styles) {
        if (!IsIE11()) {
            icon = icon.replace('fa-', '');
            icon = icon.replace('fa ', '');
            icon = icon.replace('site123-image-icon', '');
            icon = icon.replace('site123-svg-icons', '');
            icon = $.trim(icon);
            var url = $GLOBALS["cdn-user-files"] + _.folderPath + icon + '.svg?v=2';
            return '<i data-icon-name="' + icon + '" class="svg-m ' + classes + ' s123-icon-converter" style="' + styles + ' mask: url(\'' + url + '\'); -webkit-mask: url(\'' + url + '\');">&nbsp;</i>';
        } else {
            return '<i class="fa site123-image-icon fa-' + icon + ' ' + classes.replace('svg-m', '') + '"></i>';
        }
    };

    function loadFiles() {
        if ($('.f-a-css').length > 0) return;
        $('head').append('<link rel="stylesheet" class="f-a-css" href="' + $GLOBALS["cdn-system-files"] + '/files/font-awesome-4.7/css/font-awesome.min.css?v=' + $GLOBALS["v-cache"] + '">');
    }
    return _;
}();
if (typeof menuScrollOffset === 'undefined') {
    var menuScrollOffset = 0;
}
var menuScrollOffset_mobile = 60;
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
var whatScreen = {
    any: function() {
        var screenWidth = $(window).width();
        if (screenWidth <= 544) {
            return 'mobile';
        }
        if (screenWidth > 544 && screenWidth <= 767) {
            return 'tablet';
        }
        if (screenWidth > 768) {
            return 'desktop';
        }
    }
};

function MutationObserverHandler() {
    $(document).on('s123.page.ready', function(event) {
        clearInterval(window.S123_MutationObserver_Interval);
        window.S123_MutationObserver_Interval = setInterval(function() {
            if (document.S123_MutationObserver_Height !== $(document).height()) {
                $(document).trigger('s123.page.ready.refreshParallaxImages');
                $(document).trigger('s123.page.ready.refreshAOS');
                document.S123_MutationObserver_Height = $(document).height();
            }
        }, 250);
    });
}

function RefreshParallaxImages() {
    $(document).on('s123.page.ready.refreshParallaxImages', function(event) {
        var parallaxWindows = $('.parallax-window');
        if (parallaxWindows.length === 0 || $('html').hasClass('parallax-disabled')) return;
        parallaxWindows.parallax('render');
        parallaxWindows.parallax('refresh');
        setTimeout(function() {
            jQuery(window).trigger('resize').trigger('scroll');
        }, 1000);
    });
}

function Parallax_active(active) {
    if (active) {
        if ($('html').hasClass('parallax-active')) return;
        $('html')
            .addClass('parallax-active')
            .removeClass('parallax-disabled');
        $(document).trigger('s123.page.ready.refreshParallaxImages');
    } else {
        if ($('html').hasClass('parallax-disabled')) return;
        $('html')
            .removeClass('parallax-active')
            .addClass('parallax-disabled');
        DestroyParallaxImages();
    }
}

function DestroyParallaxImages() {
    $('.parallax-window').parallax('destroy');
}

function RefreshAOS() {
    $(document).on('s123.page.ready.refreshAOS', function(event) {
        AOS.refresh();
    });
}

function TopSectionInitialize() {
    $(document).on('s123.page.ready', function(event) {
        jQuery('#websitePopupHomeVideo, .promoVideoPopup .iconsCircle').on('click', function(e) {
            var $this = $(this);
            var player = $this.data('player');
            var videoURL = $this.attr('href');
            e.preventDefault();
            e.stopPropagation();
            if (player === 'site123') {
                videoURL = '/include/globalVideoPlayer.php?cad=1&url=' + encodeURIComponent(videoURL) + '&fluid=true';
            }
            if (isMobile.any()) {
                if (player === 'site123') {
                    videoURL += '&autoplay=false';
                } else {
                    videoURL = videoURL.replace('autoplay', 'disable-autoplay');
                }
            }
            buildPopup('playVideo', '', '', videoURL, true, false, true, '', '');
        });
        s123EditorVideoTagsHandler();
        S123.VideoHandler.init();
        S123.CrossOriginHandler.init();
    });
}

function CountersModuleInitialize() {
    $(document).on('s123.page.ready', function(event) {
        if ($.isFunction($.fn['themePluginCounter'])) {
            $('[data-plugin-counter]:not(.manual), .counters [data-to]').each(function() {
                var $this = $(this),
                    opts;
                var pluginOptions = $this.data('plugin-options');
                if (pluginOptions)
                    opts = pluginOptions;
                $this.themePluginCounter(opts);
            });
        }
    });
}

function ContactFormHomeInitialize() {
    $(document).on('s123.page.ready', function(event) {
        if ($('#contactUsFormHome').length !== 0) {
            var $contactUsFormHome = $('#contactUsFormHome');
            var clickAction = $contactUsFormHome.data('click-action');
            $contactUsFormHome.append($('<div class="conv-code-container"></div>'));
            var $convCodeContainer = $contactUsFormHome.find('.conv-code-container');
            var customFormMultiSteps = new CustomFormMultiSteps();
            customFormMultiSteps.init({
                $form: $contactUsFormHome,
                $nextButton: $contactUsFormHome.find('.next-form-btn'),
                $submitButton: $contactUsFormHome.find('.submit-form-btn'),
                $previousButton: $contactUsFormHome.find('.previous-form-btn'),
                totalSteps: $contactUsFormHome.find('.custom-form-steps').data('total-steps')
            });
            var forms_GoogleRecaptcha = new Forms_GoogleRecaptcha();
            forms_GoogleRecaptcha.init($contactUsFormHome);
            $contactUsFormHome.validate({
                errorElement: 'div',
                errorClass: 'help-block',
                focusInvalid: true,
                ignore: ':hidden:not(.custom-form-step:visible input[name^="datePicker-"])',
                highlight: function(e) {
                    $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
                },
                success: function(e) {
                    $(e).closest('.form-group').removeClass('has-error');
                    $(e).remove();
                },
                errorPlacement: function(error, element) {
                    if (element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
                        var controls = element.closest('div[class*="col-"]');
                        if (controls.find(':checkbox,:radio').length > 0) element.closest('.form-group').append(error);
                        else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
                    } else if (element.is('.select2')) {
                        error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
                    } else if (element.is('.chosen-select')) {
                        error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
                    } else {
                        error.appendTo(element.closest('.form-group'));
                    }
                },
                submitHandler: function(form) {
                    var $form = $(form);
                    if ($form.hasClass('custom-form') && !CustomForm_IsLastStep($form)) {
                        $form.find('.next-form-btn:visible').trigger('click');
                        return false;
                    }
                    if ($form.hasClass('custom-form') && !CustomForm_IsFillOutAtLeastOneField($form)) {
                        bootbox.alert(translations.fillOutAtLeastOneField);
                        return false;
                    }
                    $form.find('button:submit').prop('disabled', true);
                    S123.ButtonLoading.start($form.find('button:submit'));
                    var url = "/versions/" + $('#versionNUM').val() + "/include/contactO.php";
                    if ($form.hasClass('custom-form') || $form.hasClass('horizontal-custom-form')) {
                        url = "/versions/" + $('#versionNUM').val() + "/include/customFormO.php";
                    }
                    if (forms_GoogleRecaptcha.isActive && !forms_GoogleRecaptcha.isGotToken) {
                        forms_GoogleRecaptcha.getToken();
                        return false;
                    }
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: $form.serialize(),
                        success: function(data) {
                            var dataObj = jQuery.parseJSON(data);
                            $form.trigger("reset");
                            if (clickAction == 'thankYouMessage' || clickAction == '') {
                                bootbox.alert({
                                    title: translations.sent,
                                    message: translations.ThankYouAfterSubmmit + '<iframe src="/versions/' + $('#versionNUM').val() + '/include/contactSentO.php?w=' + $('#w').val() + '&websiteID=' + dataObj.websiteID + '" style="width:100%;height:30px;" frameborder="0"></iframe>',
                                    className: 'contactUsConfirm',
                                    buttons: {
                                        ok: {
                                            label: translations.Ok
                                        }
                                    },
                                    backdrop: true
                                });
                            } else {
                                if (dataObj.conv_code.length > 0) {
                                    var $convCode = $('<div>' + dataObj.conv_code + '</div>');
                                    $convCodeContainer.html($convCode.text());
                                }
                                if (top.$('#websitePreviewIframe').length) {
                                    bootbox.alert({
                                        title: translations.previewExternalLinkTitle,
                                        message: translations.previewExternalLinkMsg.replace('{{externalLink}}', '<b>' + dataObj.action.url + '</b>'),
                                        className: 'externalAlert'
                                    });
                                } else {
                                    window.open(dataObj.action.url, '_self');
                                }
                            }
                            customFormMultiSteps.reset();
                            forms_GoogleRecaptcha.reset();
                            S123.ButtonLoading.stop($form.find('button:submit'));
                            $form.find('button:submit').prop('disabled', false);
                            WizardNotificationUpdate();
                        }
                    });
                    return false;
                }
            });
            $contactUsFormHome.find('.f-b-date-timePicker').each(function() {
                var $option = $(this);
                var $datePicker = $option.find('.fake-input.date-time-picker');
                var $hiddenInput = $option.find('[data-id="' + $datePicker.data('related-id') + '"]');
                var $datePickerIcon = $option.find('.f-b-date-timePicker-icon');
                var formBuilderCalendar = new calendar_handler();
                $datePicker.data('date-format', $contactUsFormHome.data('date-format'));
                formBuilderCalendar.init({
                    $fakeInput: $datePicker,
                    $hiddenInput: $hiddenInput,
                    $fakeInputIcon: $datePickerIcon,
                    type: 'datePicker',
                    title: translations.chooseDate,
                    calendarSettings: {
                        format: $datePicker.data('date-format'),
                        weekStart: 0,
                        todayBtn: "linked",
                        clearBtn: false,
                        language: languageCode,
                        todayHighlight: true
                    },
                    onSubmit: function(selectedDate) {
                        $datePicker.html(selectedDate);
                        $hiddenInput.val(selectedDate);
                    }
                });
            });
            CustomForm_DisableTwoColumns($contactUsFormHome);
        }
    });
}

function CustomForm_DisableTwoColumns($form) {
    if ($form.find('.custom-form-steps').width() < 300) {
        $form.find('.c-f-two-columns').addClass('disableTwoColumns');
    }
}

function CustomForm_IsLastStep($form) {
    var step = $form.find('.custom-form-step').data('step');
    var totalSteps = $form.find('.custom-form-steps').data('total-steps');
    var $nextBtn = $form.find('.next-form-btn:visible');
    if ($nextBtn.length == 0 || !step || !totalSteps) return true;
    return totalSteps <= step;
}

function CustomForm_IsFillOutAtLeastOneField($form) {
    var isFillOutAtLeastOneField = false;
    if ($form.find('input[required="required"]').length > 0) return true;
    if ($form.find('select').length > 0) return true;
    $form.find('.form-group').each(function() {
        var $this = $(this);
        var $inputs = $this.find('input[name^="number-"],input[name^="file-"],textarea[name^="textarea-"],input[name^="datePicker-"],input[name^="email-"],input[name^="text-"]');
        var $checkboxs = $this.find('input[type="checkbox"]');
        var $checkedCheckboxs = $this.find('input[type="checkbox"]:checked');
        var $radios = $this.find('input[type="radio"]');
        var $checkedRadio = $this.find('input[type="radio"]:checked');
        if (!isFillOutAtLeastOneField && $inputs.length > 0) {
            $inputs.each(function() {
                if ($(this).val().length > 0) {
                    isFillOutAtLeastOneField = true;
                    return false;
                }
            });
        }
        if (!isFillOutAtLeastOneField && $checkboxs.length > 0 && $checkedCheckboxs.length > 0) {
            isFillOutAtLeastOneField = true;
            return false;
        }
        if (!isFillOutAtLeastOneField && $radios.length > 0 && $checkedRadio.length > 0) {
            isFillOutAtLeastOneField = true;
            return false;
        }
    });
    return isFillOutAtLeastOneField;
}

function GenerateMailingSubscriptionHTML(userEmail, websiteID, w) {
    var html = '';
    html += '<div class="form-group">';
    html += translations.ConfirmMailingSubscrive;
    html += '</div>';
    html += '<div class="form-group">';
    html += '<span>' + translations.subscribeTellAboutYou + '</span>';
    html += '</div>';
    html += '<!-- User Info -->';
    html += '<div class="row">';
    html += '<div class="col-xs-12 col-sm-5">';
    html += '<!-- User Name -->';
    html += '<div class="form-group">';
    html += '<label>' + translations.firstName + '</label>';
    html += '<input class="form-control user-first-name">';
    html += '</div>';
    html += '<!-- User Last Name -->';
    html += '<div class="form-group">';
    html += '<label>' + translations.lastName + '</label>';
    html += '<input class="form-control user-last-name">';
    html += '</div>';
    html += '<!-- User Phone -->';
    html += '<div class="form-group">';
    html += '<label>' + translations.phone + '</label><br>';
    html += '<input type="text" class="form-control phoneIntlInput" style="direction:ltr;">';
    html += '</div>';
    html += '<!-- User Country -->';
    html += '<div class="form-group">';
    html += '<label>' + translations.country + '</label>';
    html += '<select class="form-control user-country"></select>';
    html += '</div>';
    html += '<!-- User Email -->';
    html += '<input class="user-email" type="hidden" value="' + userEmail + '">';
    html += '<input class="website-id" type="hidden" value="' + websiteID + '">';
    html += '<input class="w" type="hidden" value="' + w + '">';
    html += '</div>';
    html += '</div>';
    return html;
}

function MailingModuleInitialize() {
    $(document).on('s123.page.ready', function(event) {
        if ($('.widget_subscribe_form').length !== 0) {
            var $widget_subscribe_form = $('.widget_subscribe_form');
            $widget_subscribe_form.each(function(index) {
                $(this).validate({
                    errorElement: 'div',
                    errorClass: 'help-block',
                    focusInvalid: true,
                    ignore: "",
                    highlight: function(e) {
                        $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
                    },
                    success: function(e) {
                        $(e).closest('.form-group').removeClass('has-error');
                        $(e).remove();
                    },
                    errorPlacement: function(error, element) {
                        error.appendTo(element.closest('.form-group'));
                    },
                    submitHandler: function(form) {
                        var $form = $(form);
                        var $userEmail = $form.find('input[name="widget-subscribe-form-email"]');
                        var websiteID = $form.find('input[name="websiteID"]').val();
                        var w = $form.find('input[name="w"]').val();
                        $form.find('button:submit').prop('disabled', true);
                        $.ajax({
                            type: 'POST',
                            url: '/versions/' + $('#versionNUM').val() + '/include/subscribe.php',
                            data: $form.serialize(),
                            success: function(respondedMessage) {
                                var respondedMessage = tryParseJSON(respondedMessage);
                                if (!respondedMessage) {
                                    $form.find('button:submit').prop('disabled', false);
                                    return;
                                }
                                var outPutHTML = GenerateMailingSubscriptionHTML($userEmail.val(), websiteID, w);
                                $form.trigger("reset");
                                bootbox.alert({
                                    title: translations.sent,
                                    message: outPutHTML,
                                    className: 'contactUsConfirm',
                                    backdrop: true,
                                    buttons: {
                                        ok: {
                                            label: 'Update',
                                            className: 'btn-primary'
                                        }
                                    }
                                });
                                var countryList = JSON.parse(respondedMessage.countryList);
                                var userCountryName = respondedMessage.countryName;
                                var countryCode = respondedMessage.countryCode;
                                $.each(countryList, function(countryCode, country) {
                                    $('.user-country').append('<option value="' + countryCode + '" ' + (userCountryName == country.name ? 'selected' : '') + '>' + country.name + '</option>');
                                });
                                $(".phoneIntlInput").intlTelInput({
                                    autoHideDialCode: true,
                                    autoPlaceholder: true,
                                    geoIpLookup: function(callback) {
                                        callback(countryCode);
                                    },
                                    initialCountry: "auto",
                                    nationalMode: true,
                                    numberType: "MOBILE",
                                    utilsScript: "/files/frameworks/intl-tel-input-8.5.2/build/js/utils.js"
                                });
                                $(".phoneIntlInput").removeAttr("autocomplete");
                                try {
                                    setTimeout(function() {
                                        $('.contactUsConfirm').find(".phoneIntlInput").val($('.contactUsConfirm').find(".phoneIntlInput").intlTelInput("getNumber", intlTelInputUtils.numberFormat.INTERNATIONAL));
                                    }, 500);
                                } catch (e) {
                                    $('.contactUsConfirm').find(".phoneIntlInput").val($('.contactUsConfirm').find(".phoneIntlInput").val());
                                }
                                $('.contactUsConfirm').find('button[data-bb-handler=ok]').off('click').on('click', function() {
                                    var websiteID = $('.contactUsConfirm').find('.website-id').val();
                                    var w = $('.contactUsConfirm').find('.w').val();
                                    var userEmail = $('.contactUsConfirm').find('.user-email').val();
                                    var userFirstName = $('.contactUsConfirm').find('.user-first-name').val();
                                    var userLastName = $('.contactUsConfirm').find('.user-last-name').val();
                                    var userPhone = $('.contactUsConfirm').find('.phoneIntlInput').val();
                                    userPhone = '+' + $('.contactUsConfirm .country-list .active').data('dial-code') + userPhone;
                                    var userCountry = $('.contactUsConfirm').find('.user-country').val();
                                    $.ajax({
                                        type: 'POST',
                                        url: '/versions/' + $('#versionNUM').val() + '/include/subscribe-update-info.php',
                                        data: {
                                            websiteid: websiteID,
                                            w: w,
                                            email: userEmail,
                                            firstName: userFirstName,
                                            lastName: userLastName,
                                            phone: userPhone,
                                            country: userCountry
                                        },
                                        success: function(response) {}
                                    });
                                });
                                $form.find('button:submit').prop('disabled', false);
                                WizardNotificationUpdate();
                            }
                        });
                        return false;
                    }
                });
            });
        }
    });
}

function OpenSearchWindow(closeLocation) {
    var currentPageUrl = window.location.href;
    var searchInput = '<div class="searchInput" style="display:none;">';
    searchInput += '<form id="searchPopup" class="searchBox">';
    searchInput += '<div class="form-group">';
    searchInput += '<div class="input-group">';
    searchInput += '<input type="text" name="widget-search-form-keyword" class="widget-search-form-keyword form-control input-lg" placeholder="' + translations.enterYourQuery + '" aria-required="true" autocomplete="off">';
    searchInput += '<span class="input-group-btn">';
    searchInput += '<button class="btn btn-lg btn-primary" type="submit">' + S123.s123IconToSvg.getHtml('search', '', '') + '</button>';
    searchInput += '</span>';
    searchInput += '</div>';
    searchInput += '</div>';
    searchInput += '<input type="hidden" name="w" value="' + $('#w').val() + '">';
    searchInput += '<input type="hidden" name="websiteID" value="' + $('#websiteID').val() + '">';
    searchInput += '</form>';
    searchInput += '</div>';
    searchInput += '<div class="result" style="display:none;">';
    searchInput += '</div>';
    buildPopup('popupFloatDivSearch', '', searchInput, '', true, false, true, closeLocation, '');
    setTimeout(function() {
        var screenHeight = $('#popupFloatDivSearch .page').outerHeight(true);
        var searchHeight = $('#popupFloatDivSearch .searchInput').outerHeight(true);
        $('#popupFloatDivSearch .result').height(screenHeight - searchHeight);
        $('#popupFloatDivSearch .searchInput').show();
        $('#popupFloatDivSearch .result').show();
        if (!is_touch_device()) {
            $('#searchPopup .widget-search-form-keyword').focus();
        }
    }, 150);
    $('#searchPopup').submit(function(event) {
        var $form = $(this);
        var $input = $form.find('input[name="widget-search-form-keyword"]');
        var resultURL = '';
        var searchParam = '-search';
        var redirectOnSubmit = false;
        var $hasEcommerce = $('#hasEcommerce');
        if ($hasEcommerce.val() == '1') {
            searchParam = '-eCommerceSearch';
            redirectOnSubmit = true;
        }
        if ($input.val().length > 0) {
            if ($('#w').val() != '') {
                resultURL = '/' + searchParam + '/' + encodeURIComponent($input.val()) + '/?w=' + $('#w').val();
            } else {
                resultURL = '/' + searchParam + '/' + encodeURIComponent($input.val()) + '/';
            }
        }
        window.history.replaceState(currentPageUrl, 'Title', resultURL);
        event.preventDefault();
        $form.find('button:submit').prop('disabled', true);
        $input.val($.trim($input.val()));
        if ($input.val().length === 0) {
            bootbox.alert({
                message: translations.searchInputValidation,
                className: 'bootbox-search-input-validation'
            }).on("hidden.bs.modal", function() {
                $form.find('button:submit').prop('disabled', false);
                $input.focus();
            });
            return;
        }
        if (redirectOnSubmit) {
            location.reload();
            return;
        }
        OpenSearchWindowSearchAjax($form);
    });
    $('#popupFloatDivSearch .popupCloseButton').on('click', function() {
        window.history.replaceState('', 'Title', currentPageUrl);
    });
    $('#popupFloatDivSearch .cover').on('click', function() {
        window.history.replaceState('', 'Title', currentPageUrl);
    });
}

function addWebsiteSearchPjaxSupport() {
    return;
    $html = $('#popupFloatDivSearch .result');
    $html.find('a').each(function() {
        var $this = $(this);
        if ($this.attr('target') == '_blank') return;
        $this.addClass('s123-fast-page-load');
    });
    S123.Pjax.refresh();
}

function OpenSearchWindowSearchAjax($form, query) {
    if (query) $('#searchPopup').find('[name="widget-search-form-keyword"]').val(query);
    $.ajax({
        type: 'POST',
        url: '/versions/' + $('#versionNUM').val() + '/include/searchResult/search.php',
        data: $form.serialize(),
        beforeSend: function() {
            $('#popupFloatDivSearch .result').html('LOADING...');
        },
        success: function(data) {
            $('#popupFloatDivSearch .result').html(data);
            $(document).trigger('s123.page.ready.data-model');
            addWebsiteSearchPjaxSupport();
        },
        complete: function(data) {
            $form.find('button:submit').prop('disabled', false);
            if (is_touch_device()) {
                document.activeElement.blur();
                $form.find('input[name="widget-search-form-keyword"]').blur();
            }
        }
    });
}

function SearchModuleInitialize() {
    $(document).on('s123.page.ready.search', function(event) {
        var $widget_search = $('.widget_search');
        $widget_search.each(function() {
            var $form = $(this);
            $form.validate({
                errorElement: 'div',
                errorClass: 'help-block',
                focusInvalid: true,
                ignore: "",
                highlight: function(e) {
                    $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
                },
                success: function(e) {
                    $(e).closest('.form-group').removeClass('has-error');
                    $(e).remove();
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.closest('.form-group'));
                },
                submitHandler: function(form) {
                    OpenSearchWindow('');
                    OpenSearchWindowSearchAjax($form, $form.find('[name="widget-search-form-keyword"]').val());
                    return false;
                }
            });
        });
    });
}

function ModulesDataModelInitialize() {
    $(document).on('s123.page.ready.data-model', function(event) {
        $('a[data-rel="popupScreen"]').off('click.popupScreen').on('click.popupScreen', function(event) {
            event.preventDefault();
            var $this = $(this);
            var href = $this.attr('href');
            var $link = $('<a href="' + href + '"></a>');
            var link = $link.get(0);
            href = link.href.replace(link.pathname, link.pathname + '/-content');
            buildPopup('pagePopupWinID', '', '', href, true, true, false, '', '');
        });
    });
}

function HomepageVideoSettingInitialize() {
    $(document).on('s123.page.ready', function(event) {
        if ($('#homepage_full_screen_3_party_video').length !== 0) {
            var $videoIframe = $('#homepage_full_screen_3_party_video');
            if ($videoIframe[0].src.indexOf("youtube.com") > -1) {
                (function() {
                    var script = document.createElement('script');
                    script.src = "http://www.youtube.com/player_api";
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
                    var player;
                    window.onYouTubePlayerAPIReady = function() {
                        player = new YT.Player('homepage_full_screen_3_party_video', {
                            playerVars: {
                                'autoplay': 1,
                                'controls': 0,
                                'autohide': 1,
                                'wmode': 'opaque',
                                'loop': 1,
                                'modestbranding': 1,
                                'rel': 0,
                                'showinfo': 0
                            },
                            events: {
                                'onReady': onPlayerReady
                            }
                        });
                    }

                    function onPlayerReady(event) {
                        event.target.mute();
                    }
                })();
            } else if ($videoIframe[0].src.indexOf("vimeo.com") > -1) {
                (function() {
                    var script = document.createElement('script');
                    script.src = "https://f.vimeocdn.com/js/froogaloop2.min.js";
                    script.onload = function(script) {
                        var player = $f($videoIframe[0]);
                        player.api('setVolume', 0);
                    };
                    firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
                })();
            }
        }
    });
}

function GoToTopButtonInitialize() {
    $(document).on('s123.page.ready', function(event) {
        var $gotoTop = $('#gotoTop');
        var top = 150;
        $(document).off('S123MagicButton.initialized.GoToTopButton').on('S123MagicButton.initialized.GoToTopButton', function(event) {
            var $allMagicButtons = $('.all-magic-buttons');
            var isFreePackage = $('html.isFreePackage').length !== 0;
            if (($('html').attr('dir') === 'rtl' && !$('.all-magic-buttons').hasClass('mg-b-icon-position-right')) || $('.all-magic-buttons').hasClass('mg-b-icon-position-left')) {
                $gotoTop.css({
                    left: $allMagicButtons.width() + parseInt($allMagicButtons.css('left')) + 10,
                    bottom: '25px'
                });
            } else {
                $gotoTop.css({
                    right: $allMagicButtons.width() + parseInt($allMagicButtons.css('right')) + 10,
                    bottom: '25px'
                });
            }
            if (isFreePackage) {
                if ($('html:not(.s123-ads-banner-small) .all-magic-buttons').length !== 0) {
                    $gotoTop.css({
                        bottom: '75px'
                    });
                } else if ($('html[dir="ltr"].in-management.s123-ads-banner-small .all-magic-buttons.mg-b-icon-position-left').length !== 0) {
                    $gotoTop.css({
                        bottom: '75px'
                    });
                } else if ($('html[dir="rtl"].in-management.s123-ads-banner-small .all-magic-buttons').length !== 0) {
                    $gotoTop.css({
                        bottom: '75px'
                    });
                }
                if ($('html[dir="rtl"].in-management.s123-ads-banner-small .all-magic-buttons.mg-b-icon-position-right').length !== 0) {
                    $gotoTop.css({
                        bottom: '25px'
                    });
                }
            }
        });
        $(window).scroll(function() {
            if ($(window).scrollTop() >= top) {
                $gotoTop.show(200);
            } else {
                $gotoTop.hide(200);
            }
        });
    });
}

function ContactUsMapObject() {
    $(document).on('s123.page.ready', function(event) {
        $('.s123-module-contact-map, .gmap-container').find('.map-container').each(function(index, upload) {
            var $this = $(this);
            var dataID = $this.attr('id');
            var dataSrc = $this.data('src');
            if (!dataSrc) dataSrc = $this.attr('src');
            var $iframe = $('<iframe id="' + dataID + '" class="map-container iframeLazyload" data-src="' + dataSrc + '" frameborder="0"></iframe>');
            $this.replaceWith($iframe);
            $iframe.css('pointer-events', 'none');
            $iframe.parent().click(function(event) {
                $iframe.css('pointer-events', 'auto');
            });
            $iframe.parent().mouseleave(function() {
                $iframe.css('pointer-events', 'none');
            });
        });
    });
}

function ActivePopupInPage() {
    $(document).on('s123.page.ready', function(event) {
        ActivePopupActionButtonsInPage();
    });
}

function ActivePopupActionButtonsInPage() {
    $('[data-toggle="search_menuCallActionIcons"]').off('click').click(function() {
        var $this = $(this);
        OpenSearchWindow($this.data('closeLocation'));
    });
    $('[data-toggle="social_menuCallActionIcons"]').off('click').click(function() {
        var $this = $(this);
        if (findBootstrapEnvironment() == 'xs') {
            var isMobile = 'mobile';
        } else {
            var isMobile = '';
        }
        var content = $('#header-social-content').html();
        buildPopup('popupFloatDivSearch', '', content, '', true, true, true, $this.data('closeLocation'), '');
        $(document).trigger('s123.page.ready.wizard_preview_manage_helpers');
    });
    $('[data-toggle="phone_menuCallActionIcons"]').off('click').click(function() {
        var $this = $(this);
        var $header_phone_content = $('#header-phone-content').clone();
        var multiPhonesObj = tryParseJSON($('#multiPhonesSettings').val());
        if (!multiPhonesObj) return;
        if (multiPhonesObj.length == 1 && multiPhonesObj[0].note == "") {
            if ((multiPhonesObj[0].type == '1' || multiPhonesObj[0].type == '4') && !isMobile.any()) {
                openMultiPhonesPopup();
                return;
            }
            if (multiPhonesObj[0].type == '3') {
                window.open($header_phone_content.find('a')[0].href, '_blank');
            } else if (multiPhonesObj[0].type == '5') {
                window.open($header_phone_content.find('a')[0].href, '_blank');
            } else {
                window.location = $header_phone_content.find('a')[0].href;
            }
            return;
        }
        openMultiPhonesPopup();

        function openMultiPhonesPopup() {
            (function() {
                var max_text_length = 0;
                $header_phone_content.find('a').each(function() {
                    var $this = $(this);
                    var text_length = $this.text().length;
                    if (text_length > max_text_length) max_text_length = text_length;
                });
                if (max_text_length > 20) {
                    $header_phone_content.find('.global-contact-details-container').addClass('g-c-d-long-text-handler');
                }
            })();
            buildPopup('popupFloatDivSearch', '', $header_phone_content.html(), '', true, true, true, $this.data('closeLocation'), '');
            $(document).trigger('s123.page.ready.wizard_preview_manage_helpers');
        }
    });
    S123.globalContactEmail.init();
    $('[data-toggle="address_menuCallActionIcons"]').off('click').click(function() {
        var $this = $(this);
        buildPopup('popupFloatDivSearch', '', $('#header-address').html(), '', true, true, true, $this.data('closeLocation'), '');
        $(document).trigger('s123.page.ready.wizard_preview_manage_helpers');
    });
}

function Site123AdButtonInitialize() {
    var $html;
    var $showSmallAdOnScroll;
    var banner_height;
    $(document).on('s123.page.ready', function(event) {
        $html = $('html');
        $showSmallAdOnScroll = $('#showSmallAdOnScroll');
        if ($showSmallAdOnScroll.length === 0) return;
        if ($showSmallAdOnScroll.hasClass('static')) {
            addHtmlClass();
            return;
        }
        isSmallAds();
        banner_height = $('#showSmallAdOnScroll').outerHeight();
        bannerHandler();
        $(window).scroll(function() {
            bannerHandler();
        });
    });
    $(document).on('s123.page.ready.isSmallAds', function(event) {
        isSmallAds();
    });

    function bannerHandler() {
        var offset = ($html.hasClass('inside_page') || $html.hasClass('rich_page')) ? 0 : 50;
        if ($(window).scrollTop() >= offset) {
            addHtmlClass();
            $showSmallAdOnScroll.css({
                bottom: '0'
            });
        } else {
            removeHtmlClass();
            $showSmallAdOnScroll.css({
                bottom: (-1 * banner_height)
            });
        }
    }

    function addHtmlClass(htmlClass) {
        $html.addClass('s123-ads-banner-active');
    }

    function removeHtmlClass() {
        $html.removeClass('s123-ads-banner-active');
    }

    function isSmallAds() {
        if (!$html.hasClass('in-management')) return;
        var isSmallAds = screen.availHeight <= 660 && screen.availWidth >= 768;
        if (isSmallAds) {
            $html.addClass('s123-ads-banner-small');
        } else {
            $html.removeClass('s123-ads-banner-small');
        }
    }
}

function ActiveLazyImageLoad() {
    window.myLazyLoad = new LazyLoad({
        elements_selector: 'img.lazyload, .bgLazyload',
        threshold: 500,
        callback_enter: function(el) {
            $(document).trigger('lazyload_enter.image', [$(el)]);
        }
    });
    window.iframeLazyload = new LazyLoad({
        threshold: 500,
        elements_selector: '.iframeLazyload'
    });
    window.promoLazyload = new LazyLoad({
        elements_selector: '.promoLazyload',
        threshold: 500,
        callback_enter: function(el) {
            $(el).addClass('parallax-window');
            $(document).trigger('s123.page.ready.refreshParallaxImages');
        }
    });
    $(document).on('s123.page.ready', function(event) {
        window.myLazyLoad.update();
        window.iframeLazyload.update();
        window.promoLazyload.update();
    });
}

function SetHeightToEle() {
    $(document).on('s123.page.ready', function(event) {
        if (whatScreen.any() == 'tablet') {
            $('#top-menu').css('max-height', $(window).height() - $('.navbar-header').outerHeight(true) - menuScrollOffset_mobile);
        }
    });
}

function GetMenuPosition() {
    $(document).on('s123.page.ready', function(event) {
        layoutMenuPositionTXT = $('#layoutMenuPositionTXT').val();
        layoutMenuPositionOpenMenuTXT = ChangeDirection(layoutMenuPositionTXT);
        if (layoutMenuPositionTXT == 'left' || layoutMenuPositionTXT == 'right') {
            FixMenuTopPosition_SideMenu();
        }
        if (layoutMenuPositionTXT == 'top' || layoutMenuPositionTXT == 'bottom') {
            FixMenuTopPosition_TopMenu();
        }
    });
}

function getWebsiteMenuPosition() {
    if ($('nav#mainNav').length > 0) {
        if ($('nav#mainNav').offset().top - $(window).scrollTop() > 0) {
            return 'bottom';
        } else {
            return 'top';
        }
    } else {
        if ($('header#header').offset().left <= 0) {
            return 'left';
        } else {
            return 'right';
        }
    }
}

function MoveFirstSection(sectionNUM) {
    var $pages = $('#s123ModulesContainer > section');
    if ($pages.length === 0) return;
    if (!sectionNUM) sectionNUM = 1;
    if (sectionNUM > $pages.length) sectionNUM = $pages.length;
    sectionNUM -= 1;
    var offset = findBootstrapEnvironment() != 'xs' ? menuScrollOffset : menuScrollOffset_mobile;
    $('html, body').stop().animate({
        scrollTop: ($pages.eq(sectionNUM).offset().top - offset)
    }, 1250, 'easeInOutExpo');
}

function MoveFirstSectionOrRedirect(url) {
    var $pages = $('#s123ModulesContainer > section');
    var offset = findBootstrapEnvironment() != 'xs' ? menuScrollOffset : menuScrollOffset_mobile;
    if ($pages.length !== 0) {
        $('html, body').stop().animate({
            scrollTop: ($pages.eq(0).offset().top - offset)
        }, 1250, 'easeInOutExpo');
    } else {
        if (url) location.href = url;
    }
}

function ScrollToModule(fromModuleID, toModuleID) {
    var offset = findBootstrapEnvironment() != 'xs' ? menuScrollOffset : menuScrollOffset_mobile;
    var $scrollTo = $('#section-' + toModuleID);
    if ($scrollTo.length === 0 && fromModuleID != '') $scrollTo = $('#section-' + fromModuleID).next('section');
    if ($('html.inside_page').length > 0) {
        if ($('#w').val() != '') {
            location.href = '/?w=' + $('#w').val() + '#section-' + toModuleID;
        } else {
            location.href = '/#section-' + toModuleID;
        }
    } else {
        if ($scrollTo.length !== 0) {
            $('html, body').stop().animate({
                scrollTop: ($scrollTo.offset().top - offset)
            }, 1250, 'easeInOutExpo');
        }
    }
}
var dropdownClickFlag = 0; //Tell us if the user click on dropdown menu so we will not close it with the DOCUMENT event
function activeDropDownMenus() {
    $(document).on('s123.page.ready', function(event) {
        activeDropDownMenusAction();
    });
}

function activeDropDownMenusAction() {
    $('.dropdown-submenu > a').off('click.activeDropDownMenusAction').on('click.activeDropDownMenusAction', function(event) {
        if ($(this).parent().data('menu-module-id') != 112) {
            event.preventDefault();
        }
    });
    $('.navPages li').find('a').off('mouseenter.hideHoverMenu');
    $('.navPages').find('.dropdown-submenu').off('click.subMenu mouseenter.subMenu mouseover.subMenu mouseout.subMenu mouseleave.subMenu').on('click.subMenu mouseenter.subMenu mouseover.subMenu mouseout.subMenu mouseleave.subMenu', function(e) {
        var $this = $(this).find('> a');
        var eventType = e.type;
        if (eventType == 'mouseenter') {
            activeDropDownMenusAction_open(e, $this);
        }
        if (eventType == 'mouseover') {
            $this.parent('.dropdown-submenu').attr('data-menuSubMenuStillOpen', 'true');
        }
        if (eventType == 'click') {
            if (dropdownClickFlag == 0) {
                activeDropDownMenusAction_open(e, $this);
            } else {
                RemoveAllDropDownMenus();
            }
        }
        if (eventType == 'mouseout') {
            $this.parent('.dropdown-submenu').attr('data-menuSubMenuStillOpen', 'false');
            setTimeout(function() {
                if ($this.parent('.dropdown-submenu').attr('data-menuSubMenuStillOpen') == 'false') {
                    $this.parent('.dropdown-submenu').removeClass('active').removeClass('open');
                }
            }, 2000);
        }
    });
    $('.navPages > li').not('.dropdown-submenu').find(' > a').off('mouseenter.hideHoverMenu').on('mouseenter.hideHoverMenu', function(e) {
        $('.dropdown-submenu').removeClass('active').removeClass('open').removeClass('activePath');
        $('.dropdown-submenu').removeAttr('data-menuSubMenuStillOpen');
    });
    $(document).off('click.subMenu').on('click.subMenu', function(e) {
        if (dropdownClickFlag == 0 && $('.dropdown-submenu.open').length > 0) {
            RemoveAllDropDownMenus();
        }
    });
}

function RemoveAllDropDownMenus() {
    $('.dropdown-submenu').removeClass('active').removeClass('open');
    $('.dropdown-submenu').removeAttr('data-menuSubMenuStillOpen');
}

function activeDropDownMenusAction_open(e, $this) {
    dropdownClickFlag = 1;
    $this.parent('.dropdown-submenu').addClass('active').addClass('open');
    $this.parents('.dropdown-submenu').each(function() {
        var $this = $(this);
        $this.addClass('activePath');
    });
    $('.dropdown-submenu').not('.activePath').removeClass('active').removeClass('open').removeClass('activePath');
    $('.dropdown-submenu.activePath').removeClass('activePath');
    setTimeout(function() {
        dropdownClickFlag = 0;
    }, 1000);
}

function RemoveScriptsResidues() {
    $('body > .tooltip').remove();
}

function TriggerS123PageReady() {
    RemoveScriptsResidues();
    $(document).trigger('s123.page.ready');
}

function TriggerS123PageLoad() {
    $(document).trigger('s123.page.load');
}

function TriggerS123CSSReload() {
    $(document).trigger('s123.css.reloaded');
}

function AddReturnToManagerBtn() {
    try {
        if (!window.opener || !window.opener.s123_mobilePreview) return;
    } catch (err) {
        return;
    }
    var html = '';
    html += '<div class="returnToManager text-center">';
    html += '<a>Back to manager</a>';
    html += '</div>';
    $(document.body).append(html);
    $('.returnToManager').css({
        'position': 'fixed',
        'bottom': '0px',
        'z-index': '100',
        'display': 'block',
        'height': '53px',
        'padding-top': '15px',
        'margin-top': '0px',
        'padding-bottom': '16px',
        'margin-bottom': '0px',
        'background-color': '#2196F3',
        'width': '100%'
    });
    $('.returnToManager a').css('color', '#ffffff');
    $('.returnToManager').on('click', function() {
        window.close();
    });
}
var layoutMenuPositionTXT;
var layoutMenuPositionOpenMenuTXT;
jQuery(function($) {
    BlockUrlMasking();
    S123.Pjax.init();
    TopSectionInitialize();
    CountersModuleInitialize();
    ContactFormHomeInitialize();
    MailingModuleInitialize();
    ActivePopupInPage();
    SearchModuleInitialize();
    ModulesDataModelInitialize();
    HomepageVideoSettingInitialize();
    HomepageCountdown();
    GoToTopButtonInitialize();
    ContactUsMapObject();
    Site123AdButtonInitialize();
    ActiveLazyImageLoad();
    SetHeightToEle();
    GetMenuPosition();
    activeDropDownMenus();
    ActiveLanguageButton();
    PageScrollByClick();
    RefreshScrollSpy();
    s123MobileMenu.init();
    RefreshParallaxImages();
    RefreshAOS();
    MutationObserverHandler();
    homepageRandomText();
    ClientZone.init();
    CartCounter.init();
    moduleLayoutCategories_shadow();
    ProgressveWebApp.init();
    S123.init();
    S123.s123IconToSvg.init();
    TriggerS123PageReady();
    jqueryValidatorTranslatedMessages();
    Order_FixWebsiteDomainUnderStoreSSL();
    AddReturnToManagerBtn();
    FitHomepageTextToWebsiteScreenWidth();
    $(document).trigger('s123.page.ready.FitHomepageTextToWebsiteScreenWidth');
    $(window).on('resize', function() {
        $(document).trigger('s123.page.ready.FitHomepageTextToWebsiteScreenWidth');
        $(document).trigger('s123.page.ready.isSmallAds');
    });
});
$(window).load(function() {
    $('html').addClass("page-loaded");
    TriggerS123PageLoad();
});
AOS.init({
    offset: 20,
    duration: 200, // we edited `aos.css`, to change it add the relevant CSS
    delay: 0
});

function BlockUrlMasking() {
    return;
    if (typeof packageNUM == 'undefined') return;
    if (!$.isNumeric($('#w').val()) && packageNUM < '2') {
        if (!S123.inIframe) return;
        if (S123.isWebsiteInSlidingWindow) return;
        if ($('#enable_as_theme').val() === '1') return;
        if (0) {
            topWindow.location = 'https://' + domain;
        }
        var websiteID = $('#websiteID').val();
        var topWindowURL = (topWindow && topWindow.location ? topWindow.location : '');
        var referrer = document.referrer;
        $.ajax({
            type: 'POST',
            url: '/manager/UrlMasking.php',
            data: 'websiteID=' + websiteID + '&topWindowURL=' + topWindowURL + '&referrer=' + referrer
        });
    }
}

function ChangeDirection(position) {
    switch (position) {
        case 'right':
            return 'left';
            break;
        case 'left':
            return 'right';
            break;
        case 'top':
            return 'bottom';
            break;
        case 'bottom':
            return 'top';
            break;
    }
}

function elementInViewport(el) {
    if (!el) return;
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;
    while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }
    return (top >= window.pageYOffset && left >= window.pageXOffset && (top + height) <= (window.pageYOffset + window.innerHeight) && (left + width) <= (window.pageXOffset + window.innerWidth));
}
var setStickyMenuHandler = function() {
    var that = {};
    that.init = function(settings) {
        if (!settings) return;
        that.offSetTop = settings.offSetTop;
        that.$mainNav = settings.$mainNav;
        that.stickyMenu = $('#stickyMenu').val();
        if (that.stickyMenu == 'on') {
            that.set();
        }
    };
    that.set = function() {
        that.$mainNav.affix({
            offset: {
                top: function() {
                    return that.offSetTop
                }
            }
        });
        that.$mainNav.off('affix-top.bs.affix').on('affix-top.bs.affix', function() {
            if (!IsHomepage()) return;
            if (that.bgHandler) return;
            if ($('body').width() === $('.body').width()) {
                that.bgHandler = $('body').css('background-color');
                $('body').css('background-color', $('#mainNav').css('background-color'));
                that.$mainNav.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(event) {
                    if (!that.bgHandler) return;
                    $('body').css('background-color', that.bgHandler);
                    that.bgHandler = null;
                });
            }
        });
        that.$mainNav.off('affix.bs.affix').on('affix.bs.affix', function() {
            if (!$(window).scrollTop()) return false;
        });
    };
    return that;
}();

function ReduseMenuSizeWhenWeDontHavePlace() {
    ReduseMenuSizeWhenWeDontHavePlace_Action($('#top-menu .navPages'), 'header', 8);
    ReduseMenuSizeWhenWeDontHavePlace_Action($('.global_footer .nav'), 'footer', 4);
    FixMenuTopPosition_TopMenu();
    ShowMenuAfterReduseSize('header');
    ShowMenuAfterReduseSize('footer');
}

function ReduseMenuSizeWhenWeDontHavePlace_Action($nav, $place, $padding) {
    if (findBootstrapEnvironment() != 'xs' && CheckMenuWidthSpace($place) && $nav.find('>li>a').length > 1) {
        if (CheckMenuWidthSpace($place)) {
            if ($nav.find('.extra-nav-more').length == 0) {
                var x = '<li class="moduleMenu extra-nav-more dropdown-submenu"><a href="#" aria-haspopup="true" aria-expanded="true"><span class="txt-container">' + translations.more.toLowerCase() + '</span>';
                if ($place == 'footer') {
                    x += ' ' + S123.s123IconToSvg.getHtml('caret-up', '', '') + '</a> <ul class="site-dropdown-menu dropdown-side-open-up';
                } else {
                    x += ' ' + S123.s123IconToSvg.getHtml('caret-down', '', '') + '</a> <ul class="site-dropdown-menu';
                }
                x += '"></ul></li>';
                $nav.append(x);
            }
            var $newLIpage = $nav.find(">li").eq(-2).detach().prependTo($nav.find('.extra-nav-more>ul'));
            if ($newLIpage.hasClass('dropdown-submenu') == true) {
                if ($('html').attr('dir') == 'rtl') {
                    $newLIpage.find('.site-dropdown-menu').addClass('dropdown-side-open-left');
                } else {
                    $newLIpage.find('.site-dropdown-menu').addClass('dropdown-side-open-right');
                }
                if ($place == 'header') {
                    if (IsIE11()) {
                        if ($('html').attr('dir') == 'rtl') {
                            $newLIpage.find('.fa').removeClass('fa-caret-down').addClass('fa-caret-left');
                        } else {
                            $newLIpage.find('.fa').removeClass('fa-caret-down').addClass('fa-caret-right');
                        }
                    } else {
                        if ($('html').attr('dir') == 'rtl') {
                            $newLIpage.find('.svg-m').replaceWith(S123.s123IconToSvg.getHtml('caret-left', '', ''));
                        } else {
                            $newLIpage.find('.svg-m').replaceWith(S123.s123IconToSvg.getHtml('caret-right', '', ''));
                        }
                    }
                }
                if ($place == 'footer') {
                    $newLIpage.find('.site-dropdown-menu').removeClass('dropdown-side-open-up');
                    var caretDir = layoutMenuPositionTXT == 'top' ? 'up' : 'down';
                    if (IsIE11()) {
                        $newLIpage.find('.fa-caret-up').removeClass('fa-caret-up').addClass('fa-caret-' + caretDir + '');
                    } else {
                        $newLIpage.find('.svg-m[data-icon-name="caret-up"]').replaceWith(S123.s123IconToSvg.getHtml('caret-' + caretDir, '', ''));
                    }
                }
            }
            if ($nav.find('.extra-nav-more').length == 0) {
                $nav.find(".extra-nav-more").detach().prependTo($nav);
            }
            ReduseMenuSizeWhenWeDontHavePlace_Action($nav, $place, $padding);
        }
    }
}

function CheckMenuWidthSpace($place) {
    if ($place == 'header') {
        switch ($('#layoutNUM').val()) {
            case '2':
                if ($('#mainNav .site_container').width() - 50 < $('#top-menu .navPages').outerWidth(true) + $('#top-menu .navActions').outerWidth(true)) {
                    return true;
                } else {
                    return false;
                }
                break;
            case '5':
                if ($('.body').outerWidth(false) - 50 < $('#top-menu .navPages').outerWidth(true) + $('#top-menu .navActions').outerWidth(true)) {
                    return true;
                } else {
                    return false;
                }
                break;
            case '13':
                if ($('#mainNav .site_container').width() - 50 < $('.navbar-header').outerWidth(true) + $('#top-menu .navPages').outerWidth(true) + $('#top-menu .navActions').outerWidth(true)) {
                    return true;
                } else {
                    return false;
                }
                break;
            case '21':
                $('#centerLogo19').remove();
                $('#top-menu').css({
                    'padding-right': '0',
                    'padding-left': '0'
                });
                if ($('#mainNav .site_container').width() - 50 < $('.navbar-header').outerWidth(true) + $('#top-menu .navPages').outerWidth(true) + $('#mainNav .navActions').outerWidth(true) + 120) {
                    return true;
                } else {
                    return false;
                }
                break;
            default:
                if (GetTopMenuWidthByIsContainer() < $('.navbar-header').outerWidth(true) + $('#top-menu .navPages').outerWidth(true) + $('#top-menu .navActions').outerWidth(true)) {
                    return true;
                } else {
                    return false;
                }
        }
    }
    if ($place == 'footer') {
        switch ($('#footer_layout').val()) {
            case '2':
                if ($('.global_footer .part1').outerWidth(true) - 100 < $('.global_footer .nav').outerWidth(true)) {
                    return true;
                } else {
                    return false;
                }
                break;
            case '1':
            case '3':
            case '4':
                if ($('.global_footer .side2').outerWidth(true) - 100 < $('.global_footer .nav').outerWidth(true)) {
                    return true;
                } else {
                    return false;
                }
        }
    }
}

function GetTopMenuWidthByIsContainer() {
    if ($('#mainNav .site_container').length > 0) {
        return $('#mainNav .site_container').width() - 50;
    } else {
        return $(window).outerWidth(true) - 50;
    }
}

function ReduseMenuSizeWhenWeDontHavePlaceHeight() {
    ReduseMenuSizeWhenWeDontHavePlaceHeight_action();
    FixMenuTopPosition_SideMenu();
    ShowMenuAfterReduseSize('');
    ReduseMenuSizeWhenWeDontHavePlace_Action($('.global_footer .nav'), 'footer', 4);
    FixMenuTopPosition_TopMenu();
    ShowMenuAfterReduseSize('footer');
}

function ReduseMenuSizeWhenWeDontHavePlaceHeight_action() {
    var $nav = $('#top-menu .navPages');
    if (findBootstrapEnvironment() != 'xs' && CheckMenuWidthSpaceHeight() && $nav.find('>li>a').length > 1) {
        if (CheckMenuWidthSpaceHeight()) {
            if ($nav.find('.extra-nav-more').length == 0) {
                var x = '<li class="moduleMenu extra-nav-more dropdown-submenu"><a href="#" aria-haspopup="true" aria-expanded="true">';
                if ($('html').attr('dir') == 'rtl') {
                    x += '<span class="txt-container">' + translations.more.toLowerCase() + '</span>';
                    x += ' ' + S123.s123IconToSvg.getHtml('caret-left', '', '');
                    x += '</a> <ul class="site-dropdown-menu dropdown-side-open-left"></ul></li>';
                } else {
                    x += '<span class="txt-container">' + translations.more.toLowerCase() + '</span>';
                    x += ' ' + S123.s123IconToSvg.getHtml('caret-right', '', '');
                    x += '</a> <ul class="site-dropdown-menu dropdown-side-open-right"></ul></li>';
                }
                $nav.append(x);
            }
            var $newLIpage = $nav.find(">li").eq(-2).detach().prependTo($nav.find('.extra-nav-more>ul'));
            if ($newLIpage.hasClass('dropdown-submenu') == true) {
                $newLIpage.find('.site-dropdown-menu').addClass('dropdown-side-open-' + layoutMenuPositionOpenMenuTXT + '');
            }
            if ($nav.find('.extra-nav-more').length == 0) {
                $nav.find('.extra-nav-more').detach().prependTo($nav);
            }
            ReduseMenuSizeWhenWeDontHavePlaceHeight_action();
        }
    }
}

function CheckMenuWidthSpaceHeight() {
    switch ($('#layoutNUM').val()) {
        default: if ($(window).outerHeight(true) - 20 < $('#header .header-column-logo').outerHeight(true) + $('#header .header-column-menu').outerHeight(true) + $('#header .header-column-menu-actions').outerHeight(true)) {
            return true;
        } else {
            return false;
        }
    }
}

function ShowMenuAfterReduseSize($place) {
    if (IsOnlyContent()) return;
    if ($('#top-menu').length > 0 && $('#layoutNUM').val() == '21' && $place == 'header') {
        $('#centerLogo19').remove();
        $('#top-menu').css({
            'padding-right': '0',
            'padding-left': '0'
        });
        var menuWidth = ($('#top-menu .navPages').outerWidth(true) + $('#top-menu .navActions').outerWidth(true)) / 2;
        var sumLIofMenu = 0;
        var saveLIplace = 1;
        var extraPaddingFromSideOne = 0;
        $('#top-menu .navPages > li').each(function() {
            var $this = $(this);
            sumLIofMenu += $this.outerWidth(true);
            if (sumLIofMenu >= menuWidth) {
                extraPaddingFromSideOne = sumLIofMenu - menuWidth;
                return false;
            }
            saveLIplace++;
        });
        if ($('#top-menu .navPages > li').eq(saveLIplace - 1).outerWidth(true) * 0.6 <= (extraPaddingFromSideOne)) {
            saveLIplace = saveLIplace - 1;
        }
        if ($('#top-menu .navPages > li').eq(saveLIplace - 1).length > 0) {
            $('<li id="centerLogo19">' + $('.navbar-header').html() + '</li>').insertAfter($('#top-menu .navPages > li').eq(saveLIplace - 1));
        } else {
            $('#top-menu .navPages').append('<li id="centerLogo19">' + $('.navbar-header').html() + '</li>');
        }
        (function() {
            var $logo = $('#centerLogo19 a');
            var href = $logo.attr('href');
            $logo
                .attr('href', 'javascript:void(0);')
                .off('click.scrollspyFix')
                .on('click.scrollspyFix', function(event) {
                    event.preventDefault();
                    if (!(IsWizard() && IsHomepage())) {
                        location.href = href;
                    }
                });
        })();
        if (IsWizard()) {
            $(document).trigger('s123.page.ready.wizard_preview_manage_helpers');
        }
        ShowMenuAfterReduseSize_finishCalc();
        ShowMenuAfterReduseSize_finishCalc();
        ShowMenuAfterReduseSize_finishCalc();
        ShowMenuAfterReduseSize_finishCalc();
    }
    if ($('#header').length == 0 && $('#top-menu').length > 0 && $place == 'header') {
        var rectMenu;
        var rectHeader;
        rectMenu = Math.round($('#top-menu').outerWidth());
        rectHeader = Math.round($('#mainNav .site_container').width());
        if ($('#mainNavMobile').is(":visible") == false && rectMenu > rectHeader && $('#top-menu .navActions .header-menu-wrapper').length == 0 && $('#top-menu.affix').length == 0) {
            $('#top-menu .navActions').append('<li class="header-menu-wrapper replaceActionButtonsToIcon"><a data-close-location="left" class="btn" role="button" data-container="body" data-toggle="menuCallActionIcons">' + S123.s123IconToSvg.getHtml('bars', '', '') + '</a></li>');
            $('.action-button-wrapper').hide();
            TriggerS123PageReady();
            ResetMoreButton();
        }
        rectMenu = Math.round($('#top-menu').outerWidth());
        rectHeader = Math.round($('#mainNav .site_container').width());
        if ($('#mainNavMobile').is(":visible") == false && rectMenu > rectHeader && $('#top-menu .navActions .header-menu-wrapper').length > 0 && $('.replaceActionButtonsToIcon').length > 0 && $('.replaceActionButtonsToIconRemoveExtra').length == 0 && $('#top-menu.affix').length == 0) {
            $('.header-phone-wrapper, .header-address-wrapper, .header-social-wrapper, .header-search-wrapper, .header-email-wrapper').hide();
            $('.replaceActionButtonsToIcon').addClass('replaceActionButtonsToIconRemoveExtra');
            TriggerS123PageReady();
            ResetMoreButton();
        }
    }
    if ($('#mainNavMobile').is(":visible")) {
        if (window.mainNavMobile_page_loaded_icons_states) {
            window.mainNavMobile_page_loaded_icons_states.show();
        } else {
            window.mainNavMobile_page_loaded_icons_states = $('#mainNavMobile .navActions > li:visible')
                .not('.header-wish-list')
                .not('.header-cart-wrapper');
        }
        if ($('#mainNavMobile .navActions > li:visible').length > 2) {
            $('#mainNavMobile .navActions > li.header-social-wrapper ').hide();
            if ($('#mainNavMobile .navActions > li:visible').length > 2) {
                $('#mainNavMobile .navActions > li.header-search-wrapper').hide();
                if ($('#mainNavMobile .navActions > li:visible').length > 2) {
                    $('#mainNavMobile .navActions > li.header-email-wrapper').hide();
                    if ($('#mainNavMobile .navActions > li:visible').length > 2) {
                        $('#mainNavMobile .navActions > li.header-address-wrapper').hide();
                        if ($('#mainNavMobile .navActions > li:visible').length > 2) {
                            $('#mainNavMobile .navActions > li.header-phone-wrapper').hide();
                        }
                    }
                }
            }
        }
    }
    if ($place == '' || $place == 'header') {
        $('#mainNav #top-menu .navPages, #mainNav #top-menu .navActions, #mainNav #top-menu .headerSocial, #header .header-row').css({
            'opacity': '1'
        });
    }
    if ($place == 'footer') {
        $('.global_footer .nav').css({
            'opacity': '1'
        });
    }
    $('#mainNavMobile').css({
        'opacity': '1'
    });
    activeDropDownMenusAction();
}

function ShowMenuAfterReduseSize_finishCalc() {
    var screenCenterPoint = $(window).outerWidth(true) / 2;
    var logoLeftPXforCenter = Math.round(screenCenterPoint - ($('#centerLogo19').outerWidth(true) / 2));
    var logoExistingLeftPX = Math.round($('#centerLogo19').offset().left);
    if (logoLeftPXforCenter > logoExistingLeftPX) {
        var result = (logoLeftPXforCenter - logoExistingLeftPX);
        var existingPadding = parseInt($('#top-menu').css('padding-left'), 10);
        result = result + existingPadding;
        $('#top-menu').css('padding-left', (result) + 'px');
    } else {
        var result = (logoExistingLeftPX - logoLeftPXforCenter);
        var existingPadding = parseInt($('#top-menu').css('padding-right'), 10);
        result = result + existingPadding;
        $('#top-menu').css('padding-right', (result) + 'px');
    }
}

function FixMenuTopPosition_SideMenu() {
    $('.navPages .dropdown-submenu > a').off('click.FixMenuTopPosition mouseenter.FixMenuTopPosition').on('click.FixMenuTopPosition mouseenter.FixMenuTopPosition', function(e) {
        var $this = $(this).parent().find('.site-dropdown-menu');
        if ($this.length > 0) {
            setTimeout(function() {
                var rect = $this[0].getBoundingClientRect();
                if (rect.top + rect.height > window.innerHeight && rect.height < window.innerHeight) {
                    $this.css('top', parseInt($this.css('top'), 10) - (rect.top + rect.height - window.innerHeight) - 25);
                }
                $this.css('opacity', '1');
            }, 100);
        }
    });
};

function FixMenuTopPosition_TopMenu() {
    $('.navPages .dropdown-submenu > a, .global_footer .nav .dropdown-submenu > a').off('click.FixMenuTopPosition mouseenter.FixMenuTopPosition').on('click.FixMenuTopPosition mouseenter.FixMenuTopPosition', function(e) {
        var $this = $(this).parent().find('.site-dropdown-menu');
        if ($this.length > 0) {
            setTimeout(function() {
                if ($this.length > 0) {
                    var rect = $this[0].getBoundingClientRect();
                    if (rect.top + rect.height > window.innerHeight && rect.height < window.innerHeight) {
                        $this.css({
                            'bottom': '100%',
                            'top': 'auto'
                        });
                    } else {
                        if (rect.top < 0 || rect.bottom < 0) {
                            $this.css({
                                'top': '100%',
                                'bottom': 'auto'
                            });
                        }
                    }
                    if ($('html').attr('dir') != 'rtl') {
                        if (rect.right > window.innerWidth && rect.width < window.innerWidth) {
                            $this.css({
                                'left': 'auto',
                                'right': '0'
                            });
                        }
                    } else {
                        if (rect.left < 0 && rect.width < window.innerWidth) {
                            $this.css({
                                'right': 'auto',
                                'left': '0'
                            });
                        }
                    }
                }
                $this.css('opacity', '1');
            }, 100);
        }
    });
}

function ResetMoreButton() {
    $('#mainNav #top-menu .navPages, #mainNav #top-menu .navActions, #mainNav #top-menu .headerSocial, #header .header-row, .global_footer .nav').css({
        'opacity': '0'
    });
    $('#top-menu .navPages .extra-nav-more > ul > li').each(function() {
        var $this = $(this);
        if ($('#mainNav #top-menu').length > 0) {
            $this.find('.site-dropdown-menu').removeClass('dropdown-side-open-left');
            if ($('html').attr('dir') == 'rtl') {
                $this.find('.fa').removeClass('fa-caret-left').addClass('fa-caret-down');
            } else {
                $this.find('.fa').removeClass('fa-caret-right').addClass('fa-caret-down');
            }
        }
        $this.appendTo($('#top-menu .navPages'));
    });
    $('#top-menu .navPages .extra-nav-more').remove()
    $('footer .navPages .extra-nav-more > ul > li').each(function() {
        var $this = $(this);
        $this.appendTo($('footer .navPages'));
    });
    $('footer .navPages .extra-nav-more').remove();
    if (layoutMenuPositionTXT == 'left' || layoutMenuPositionTXT == 'right') {
        ReduseMenuSizeWhenWeDontHavePlaceHeight();
    } else {
        ReduseMenuSizeWhenWeDontHavePlace();
    }
}

function ActiveLanguageButton() {
    $(document).on('s123.page.ready.ActiveLanguageButton', function(event) {
        $('.website-languages-menu-link').off('click').on('click', function() {
            openDivMenuOnLanguageClickAction();
        });
    });
}

function openDivMenuOnLanguageClickAction() {
    var content = '<ul class="languagesList navPagesPopup">';
    $.each(languageList, function(index, language) {
        if (language['countryCode'] && language['countryCode'] != '') {
            content += '<li><a href="' + language['url'] + '"><img src="/files/vendor/flag-icon-css-master/flags/1x1/' + language['countryCode'] + '.svg" style="width:20px;height:14px;">&nbsp;' + language['name'] + '</a></li>';
        } else {
            content += '<li><a href="' + language['url'] + '">' + language['name'] + '</a></li>';
        }
    });
    content += '</ul>';
    buildPopup('popupFloatDivMenuLanguages', '', content, '', true, true, true, '', '');
}

function PageScrollByClick() {
    $(document).on('s123.page.ready.pageScrollByClick', function(event) {
        var offset = findBootstrapEnvironment() != 'xs' ? menuScrollOffset : menuScrollOffset_mobile;
        $('a.page-scroll').off('click.scrollEvent').on('click.scrollEvent', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: ($($anchor.attr('href')).offset().top - offset)
            }, 1250, 'easeInOutExpo');
            event.preventDefault();
        });
    });
}

function RefreshScrollSpy() {
    $(document).on('s123.page.ready.refreshScrollSpy', function(event) {
        $('body').scrollspy('refresh');
    });
};

function findBootstrapEnvironment() {
    var envs = ['xs', 'sm', 'md', 'lg'];
    var $el = $('<div>');
    $el.appendTo($('body'));
    for (var i = envs.length - 1; i >= 0; i--) {
        var env = envs[i];
        $el.addClass('hidden-' + env);
        if ($el.is(':hidden')) {
            $el.remove();
            return env;
        }
    }
}

function findBootstrapColPerRow($items) {
    if (!$items || $items.length === 0) return 0;
    var first_item_offset_top = $items.first().offset().top;
    var col_per_row = 0;
    $items.each(function() {
        if ($(this).offset().top === first_item_offset_top) {
            col_per_row += 1;
        } else {
            return;
        }
    });
    return col_per_row;
}

function buildSmallPopup(popID, title, content, iframeURL, closeEsc, closeEnter, oneColor, closeLocation) {
    if (iframeURL != '') {
        content = '<iframe id="' + popID + '_iFrame" src="' + iframeURL + '" scrolling="no"></iframe>';
    }
    var x = '<div id="' + popID + '" class="quickPopupWin">';
    x += '<div class="cover">';
    x += '</div>';
    x += '<div class="content">';
    x += content;
    x += '</div>';
    x += '</div>';
    $('body').append(x);
    popupWinScrollAction(1);
    setTimeout(function() {
        $('#' + popID + '').find('.content').addClass('open');
    }, 100);
    $('#' + popID + ' .cover').click(function() {
        buildSmallPopup_CloseAction(popID);
    });
}

function buildSmallPopup_CloseAction(popID) {
    var $popup = $('#' + popID);
    setTimeout(function() {
        $popup.find('.content').removeClass('open');
    }, 100);
    setTimeout(function() {
        $('#' + popID).remove();
        popupWinScrollAction(0);
    }, 700);
}

function buildPopup(popID, title, content, iframeURL, closeEsc, closeEnter, oneColor, closeLocation, customClasses) {
    if ($('#' + popID).length !== 0) return;
    if (iframeURL != '') {
        var iClass = '';
        if (iframeURL.indexOf("youtube.com") > -1) iClass = 'videoSize';
        if (iframeURL.indexOf("vimeo.com") > -1) iClass = 'videoSize';
        content = '<iframe id="' + popID + '_iFrame" src="' + iframeURL + '" class="iframe ' + iClass + '" allowfullscreen></iframe>';
    }
    var x = '<div id="' + popID + '" class="popupWin container ' + customClasses + ' ' + (oneColor ? 'oneColor' : '') + '">';
    x += '<div class="cover">';
    x += '</div>';
    x += '<div class="content container">';
    x += '<div class="page">' + content + '</div>';
    x += '</div>';
    x += '<div class="popupCloseButton ' + closeLocation + '">';
    x += S123.s123IconToSvg.getHtml('times', '', '');
    x += '</div>';
    x += '</div>';
    $('body').append(x);
    popupWinScrollAction(1);
    $('#' + popID).find('.page').css({
        overflow: 'hidden'
    });
    setTimeout(function() {
        $('#' + popID).addClass('open');
        if (iframeURL == '') $('#' + popID).find('.page').css({
            overflow: 'auto'
        });
        $(document).trigger('build_popup.open');
    }, 100);
    $('#' + popID).find('.popupCloseButton').click(function() {
        buildPopup_CloseAction(popID);
    });
    $('#' + popID + ' .cover').click(function() {
        buildPopup_CloseAction(popID);
    });
    if (iframeURL != '') {
        $('#' + popID + '_iFrame').on("load", function() {
            setTimeout(function() {
                var screenHeight = $('#pagePopupWinID .page').outerHeight(true);
                $('#pagePopupWinID_iFrame').height(screenHeight);
                if (!is_touch_device()) {
                    $('#' + popID).find('.page').css({
                        overflow: 'hidden'
                    });
                } else {
                    $('#' + popID).find('.page').css({
                        overflow: 'auto'
                    });
                }
            }, 300);
        });
    }
    $(document).keyup(function(e) {
        if (closeEsc == true && e.keyCode === 27) {
            buildPopup_CloseAction(popID);
        }
    });
}

function is_touch_device() {
    return 'ontouchstart' in window // works on most browsers
        ||
        navigator.maxTouchPoints; // works on IE10/11 and Surface
};

function buildPopup_CloseAction(popID) {
    var $popup = $('#' + popID);
    $popup.find('.page').css({
        overflow: 'hidden'
    });
    $popup.removeClass('open');
    setTimeout(function() {
        $('#' + popID).remove();
        if ($('.popupWin').length == 0) {
            popupWinScrollAction(0);
        }
    }, 700);
    $(document).trigger('build_popup.close');
}

function buildPopup_CloseAllPopupsInPage() {
    if ($('.popupWin').length > 0) {
        $('.popupWin').each(function() {
            var popID = $(this).attr('id');
            buildPopup_CloseAction(popID);
        });
    }
}

function jqueryValidatorTranslatedMessages() {
    jQuery.extend(jQuery.validator.messages, {
        required: translations.jqueryValidMsgRequire,
        remote: translations.jqueryValidMsgRemote,
        email: translations.jqueryValidMsgEmail,
        url: translations.jqueryValidMsgUrl,
        date: translations.jqueryValidMsgDate,
        dateISO: translations.jqueryValidMsgDateISO,
        number: translations.jqueryValidMsgNumber,
        digits: translations.jqueryValidMsgDigits,
        creditcard: translations.jqueryValidMsgCreditcard,
        equalTo: translations.jqueryValidMsgEqualTo,
        accept: translations.jqueryValidMsgAccept,
        maxlength: jQuery.validator.format(translations.jqueryValidMsgMaxlength),
        minlength: jQuery.validator.format(translations.jqueryValidMsgMinlength),
        rangelength: jQuery.validator.format(translations.jqueryValidMsgRangelength),
        range: jQuery.validator.format(translations.jqueryValidMsgRange),
        max: jQuery.validator.format(translations.jqueryValidMsgMax),
        min: jQuery.validator.format(translations.jqueryValidMsgMin)
    });
}
S123.VideoHandler = function() {
    var _ = {};
    _.init = function() {
        $('.s123-video-handler:not([data-is-full-screen="true"])').on('click', function() {
            s123VideoHandler($(this));
        });
        if (isMobile.any()) {
            $('.s123-video-handler:not([data-player="youtube"]):not([data-is-full-screen="true"])').imagesLoaded().progress(function(instance, image) {
                s123VideoHandler($(image.img).closest('.s123-video-handler'));
            });
        }
        $('.s123-video-handler[data-is-full-screen="true"]').on('click', function(event) {
            var $this = $(this);
            var src = $this.data('video');
            $.magnificPopup.open({
                mainClass: 'mfp-e-product-gallery',
                delegate: '.e-p-mfp-image', // Categories Filter
                closeOnContentClick: true,
                closeBtnInside: false,
                tLoading: translations.loading, // Text that is displayed during loading
                type: 'iframe',
                items: {
                    src: src
                },
                iframe: {
                    markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' + '<div class="mfp-title" style="position: absolute; padding-top: 5px;"></div>' + '</div>',
                    patterns: {
                        youtube: {
                            index: 'youtube.com/',
                            id: function(url) {
                                var matches = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
                                if (!matches || !matches[1]) return null;
                                return matches[1];
                            },
                            src: '//www.youtube.com/embed/%id%?autoplay=1'
                        },
                        vimeo: {
                            index: 'vimeo.com/',
                            id: function(url) {
                                var matches = url.match(/(https?:\/\/)?(www.)?(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/);
                                if (!matches || !matches[5]) return null;
                                return matches[5];
                            },
                            src: '//player.vimeo.com/video/%id%?autoplay=1'
                        },
                        site123: {
                            index: $GLOBALS['cdn-user-files'],
                            id: function(url) {
                                if (isMobile.any()) url += '&autoplay=0';
                                return url;
                            },
                            src: '/include/globalVideoPlayer.php?cad=1&url=%id%'
                        },
                        site123Processing: {
                            index: '/files/images/video-processing.png',
                            id: function(url) {
                                if (isMobile.any()) url += '&autoplay=0';
                                return url;
                            },
                            src: '/include/globalVideoPlayer.php?cad=1&url=%id%'
                        }
                    }
                },
            });
        });
    };
    return _;
}();

function s123VideoHandler($obj) {
    var player = $obj.data('player');
    var video_id = $obj.data('video-id');
    var videoURL = $obj.data('video');
    var customStyle = $obj.find('img').attr('style') ? $obj.find('img').attr('style') : '';
    var width = $obj.find('img').width();
    var height = $obj.find('img').height();
    if (player === 'site123') {
        videoURL = '/include/globalVideoPlayer.php?cad=1&url=' + encodeURIComponent(videoURL) + '&width=' + width + '&height=' + height;
    }
    if (isMobile.any()) {
        if (player === 'site123') {
            videoURL += '&autoplay=false';
        } else if (player === 'vimeo') {
            videoURL = videoURL.replace('autoplay', 'disable-autoplay');
        }
    } else {
        videoURL += '&autoplay=true';
    }
    $obj.replaceWith('<div class="video-wrapper"><iframe id="v-h-' + video_id + '" data-player="' + player + '" style="' + customStyle + 'width:' + width + 'px;height:' + height + 'px;" type="text/html" src="' + videoURL + '" allow="autoplay; fullscreen" frameborder="0" allowfullscreen></iframe></div>');
    (function() {
        if (player !== 'youtube') return;
        if (!isMobile.any()) return;
        var youtube_player;
        if ($('#youtube_player_api').length === 0) {
            var script = document.createElement('script');
            script.id = 'youtube_player_api';
            script.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
            window.onYouTubePlayerAPIReady = function() {
                youtube_player = YouTubePlayerInitialize(video_id);
            }
        } else {
            youtube_player = YouTubePlayerInitialize(video_id);
        }

        function onPlayerReady(event) {
            event.target.mute();
            event.target.playVideo();
        }

        function YouTubePlayerInitialize(video_id) {
            youtube_player = new YT.Player('v-h-' + video_id, {
                events: {
                    'onReady': onPlayerReady
                }
            });
            return youtube_player;
        }
    })();
}

function s123EditorVideoTagsHandler() {
    $('.fr-view video').each(function() {
        var $video = $(this);
        var src = $video.attr('src');
        var extension = src.split("?")[0].split('.').pop();
        var thumbnail = src.replace('.' + extension, '-thumbnail.jpg');
        $video.replaceWith('<div class="s123-video-handler" data-player="site123" data-video="' + src + '" style="max-width: 100%;max-height:100%;"><img style="' + $video.attr('style') + '" src="' + thumbnail + '"><div class="s123-video-cover"><a class="s123-video-play-icon"><i class="fa fa-play"></i></a></div></div>');
    });
}

function WizardNotificationUpdate() {
    if (IsWizard()) topWindow.Wizard.Notification.update();
}

function calculateCouponDiscount(totalPrice, $couponDiscount, $couponType) {
    if ($couponDiscount.length === 0 || !$.isNumeric($couponDiscount.val())) return 0;
    if ($couponType.length === 0 || !$.isNumeric($couponType.val())) return 0;
    if ($couponType.val() == '0') {
        return (parseFloat(totalPrice) * parseFloat($couponDiscount.val()) / 100);
    } else {
        return totalPrice > 0 ? parseFloat($couponDiscount.val()) : 0;
    }
}

function getCouponDetails(callback, couponCode, w, websiteID, versionNUM, total) {
    if (couponCode.length === 0) return;
    $.ajax({
        type: "POST",
        url: "/versions/" + versionNUM + "/wizard/orders/front/getCouponsAjax.php",
        data: 'w=' + w + '&websiteID=' + websiteID + '&couponCode=' + couponCode + '&total=' + total,
        success: function(data) {
            try {
                data = jQuery.parseJSON(data);
            } catch (e) {
                return;
            }
            if (callback) callback.call(this, data);
        }
    });
}

function getFormValues($form) {
    var values = {};
    $.each($form.serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });
    return values;
}

function getScrollbarWidth() {
    if ($(document).height() > $(window).height()) { //Make sure this page have a scroll
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
        document.body.appendChild(outer);
        var widthNoScroll = outer.offsetWidth;
        outer.style.overflow = "scroll";
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);
        var widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        return widthNoScroll - widthWithScroll;
    } else {
        return 0; //If this page is short without a scroll we don't add padding
    }
}

function popupWinScrollAction(addBOO) {
    var scrollWidth = getScrollbarWidth();
    if (addBOO == 1 && scrollWidth > 0) {
        $('body').addClass('popupWinScroll');
        $('body').css('padding-right', scrollWidth + 'px');
        $('#mainNavMobile').css('padding-right', scrollWidth + 'px');
        $('#showSmallAdOnScroll').css('padding-right', scrollWidth + 'px');
        if (layoutMenuPositionTXT == 'left' || layoutMenuPositionTXT == 'right') {} else {
            $('#mainNav').css('padding-right', scrollWidth + 'px');
            $('#mainNav #top-menu.affix').css('padding-right', scrollWidth + 'px');
        }
    } else {
        $('body').removeClass('popupWinScroll');
        $('body').css('padding-right', '0px');
        $('#mainNavMobile').css('padding-right', '0px');
        $('#showSmallAdOnScroll').css('padding-right', '0px');
        if (layoutMenuPositionTXT == 'left' || layoutMenuPositionTXT == 'right') {} else {
            $('#mainNav').css('padding-right', '0px');
            $('#mainNav #top-menu.affix').css('padding-right', '0px');
        }
    }
}

function Order_FixWebsiteDomainUnderStoreSSL() {
    var $store_ssl_domain = $('#store_ssl_domain');
    var $orderScreen = $('#orderScreen');
    var $websiteDomain = $('#websiteDomain');
    if ($orderScreen.length === 0 || $websiteDomain.length === 0 || $store_ssl_domain.length === 0) return;
    if (location.href.indexOf($store_ssl_domain.val()) === -1) return;
    if ($websiteDomain.val().length === 0) return;
    $('a').each(function() {
        var $this = $(this);
        var href = $this.attr('href');
        if (href && href.charAt(0) == '/') {
            var newHref = $websiteDomain.val() + href;
            $this.attr('href', newHref);
        }
    });
}

function IsHomepage() {
    return $('html.home_page').length === 1;
}

function IsRichPage() {
    return $('html.rich_page').length === 1;
}

function IsWizard() {
    return topWindow.Wizard ? true : false;
}

function IsOnlyContent() {
    var path = window.location.pathname.split("/");
    return path.pop() == '-content';
}
var topWindow = function() {
    var win = window;
    var top = win;
    while (win.parent != win) {
        try {
            win.parent.document;
            top = win.parent;
        } catch (e) {}
        win = win.parent;
    }
    return top;
}();
var holdChangeTextIntervals = []; //Hold all active interval so it will be easy to kiil them before trigger PAGE LOAD from interface
function homepageRandomText() {
    $(document).on('s123.page.ready', function(event) {
        holdChangeTextIntervals.forEach(function(element) {
            clearInterval(element);
        });
        $('.homepageRandomText').each(function() {
            homepageRandomTextAction(this, 'no');
        });
        $('.homepageRandomTextStop').each(function() {
            homepageRandomTextAction(this, 'yes');
        });
    });
}

function homepageRandomTextAction(t, hasStop) {
    var $this = $(t);
    var words = $this.data('text');
    var counter = 0;
    var speed = 5000;
    words = words.split('|');
    if (words.length > 0) {
        if (words[words.length - 1].includes('t:')) {
            var speedEle = words[words.length - 1].replace(/t:(.*)/, '$1');
            if ($.isNumeric(speedEle)) {
                speed = speedEle;
                words.splice(words.length - 1, 1);
            }
        }
        $this.html(words[counter]).addClass('elementToFadeIn');
        counter++;
        var inst = setInterval(function() {
            $this.removeClass('elementToFadeIn');
            setTimeout(function() {
                $this.html(words[counter]).addClass('elementToFadeIn');
            }, 50);
            counter++;
            if (counter >= words.length) {
                counter = 0;
                if (hasStop == 'yes') {
                    clearInterval(inst); // uncomment this if you want to stop refreshing after one cycle
                }
            }
        }, speed);
        holdChangeTextIntervals.push(inst);
    }
}
var ClientZone = function() {
    var CZ = {};
    CZ.init = function() {
        $(document).on('s123.page.ready', function(event) {
            CZ.updateClientIcon();
        });
    };
    CZ.updateClientIcon = function() {
        var $clientZoneLink = $('.header-client-zone-wrapper .client-zone-link');
        if ($clientZoneLink.length === 0) return;
        var $client = tryParseJSON($.cookie($('#websiteID').val() + '-clientZone'));
        if (!$client) return;
        $clientZoneLink.removeAttr('data-image');
        $clientZoneLink.removeAttr('data-letters');
        if ($client.profile_image) {
            $clientZoneLink.attr('data-image', 'true');
            $clientZoneLink.css('background-image', 'url(' + getImageWRV1(100, $client.profile_image) + ')');
        } else if ($client.name) {
            $clientZoneLink.attr('data-letters', $client.name[0]);
            $clientZoneLink.css('background-image', '');
        } else if ($client.email) {
            $clientZoneLink.attr('data-letters', $client.email[0]);
            $clientZoneLink.css('background-image', '');
        }
        if ($client.name !== 0) $clientZoneLink.attr('title', $client.name);
    };
    CZ.getClientAddress = function(callback) {
        var $client = tryParseJSON($.cookie($('#websiteID').val() + '-clientZone'));
        if (!$client) return;
        $.ajax({
            type: 'POST',
            url: '/versions/' + $('#versionNUM').val() + '/wizard/clientZone/getClientAddress.php',
            data: {
                websiteID: $('#websiteID').val(),
                w: $('#w').val()
            },
            success: function(response) {
                response = JSON.parse(response);
                if (response.status == 'Success') {
                    if (callback) callback.call(this, response.addresses);
                }
            }
        }).always(function() {
            $('.mainOrderBox .order-spacing-box .order-form-box').show();
        });
    }
    return CZ;
}();
var CartCounter = function() {
    var CC = {};
    CC.init = function() {
        if (S123.QueryString.onlyContent == 1) return;
        $(document).on('s123.page.ready', function(event) {
            CC.updateCartIcon();
        });
        CC.oldCustomersSupport();
    };
    CC.updateCartIcon = function() {
        var $headerCartWrapper = $('.header-cart-wrapper');
        if ($headerCartWrapper.length === 0) return;
        var productsNumber = $.cookie($('#websiteID').val() + '-cartCounter');
        if (!$.isNumeric(productsNumber)) productsNumber = 0;
        if (parseInt(productsNumber) === 0) {
            if (!$headerCartWrapper.hasClass('show-static')) {
                $headerCartWrapper.hide();
                ResetMoreButton();
            }
            $headerCartWrapper.find('.count').hide();
        } else {
            if (!$headerCartWrapper.hasClass('show-static')) {
                $headerCartWrapper.show();
                ResetMoreButton();
            }
            $headerCartWrapper.find('.count').html(productsNumber).css({
                display: 'flex'
            });
        }
    };
    CC.oldCustomersSupport = function() {
        if ($.cookie('CartCount') !== 'yes') return;
        $.ajax({
            type: "GET",
            url: "/versions/" + $('#versionNUM').val() + "/wizard/orders/front/countUserCart.php",
            data: 'w=' + $('#w').val() + '&websiteID=' + $('#websiteID').val() + '&tranW=' + websiteLanguageCountryFullCode + '&moduleTypeNUM=37'
        });
        CC.updateCartIcon();
    };
    return CC;
}();
S123.Pjax = function() {
    var that = {
        active: false,
        isMobile: null,
        pjaxSupported: null
    };
    that.init = function() {
        that.isMobile = findBootstrapEnvironment() === 'xs';
        that.pjaxSupported = $('#pjaxSupported').val();
        if ($('#onepage').val() !== '0') return;
        if (that.pjaxSupported != '1') return;
        that.breadcrumbInitialize();
        that.pjaxInit();
        NProgress.configure({
            showSpinner: false
        });
        document.addEventListener('pjax:send', function(event) {
            $(document).trigger('pjax_magnific_popup_reset');
            NProgress.start();
            $('.s123-front-last-element').nextAll().remove();
            that.triggerSend();
        });
        document.addEventListener('pjax:complete', function(event) {
            var is_data_page = that.isDataPage(event.request.response);
            if (is_data_page) {
                that.loadDataPageResources(event);
            } else {
                that.completeRequestActions(event, 0);
            }
        });
    };
    that.completeRequestActions = function(event, is_trigger_data_ready) {
        that.breadcrumbInitialize();
        if (typeof FB !== 'undefined') FB.XFBML.parse();
        window.grecaptcha = null;
        window.recaptcha = null;
        NProgress.done();
        if (is_trigger_data_ready) TriggerS123PageReadyData();
        TriggerS123PageReady();
        TriggerS123PageLoad();
        S123.Pjax.refresh();
        that.triggerComplete();
    };
    that.loadDataPageResources = function(event) {
        if (that.isDataResourcesLoaded) {
            that.completeRequestActions(event, 1);
            return;
        }
        that.isDataResourcesLoaded = true;
        var $request_response = $(event.request.response);
        var resource_deferreds = [];
        var $website_front_data_css = $request_response.filter('.website-front-data-css');
        $website_front_data_css.each(function(index, resource) {
            var d1 = $.Deferred();
            $(resource).load(function() {
                d1.resolve();
            })
            resource_deferreds.push(d1);
        });
        $('head').append($website_front_data_css);
        var $website_front_data_js = $request_response.filter('.website-front-data-js');
        $website_front_data_js.each(function(index, resource) {
            var d1 = $.Deferred();
            $.getScript(resource.src)
                .done(function(script, textStatus) {
                    d1.resolve();
                });
            resource_deferreds.push(d1);
        });
        $.when.apply($, resource_deferreds).done(function() {
            that.completeRequestActions(event, 0);
        });
    };
    that.pjaxInit = function() {
        var pjax_hash_delay = window.location.hash.length !== 0 ? 100 : 0;
        setTimeout(function() {
            that._p = new Pjax({
                elements: '.s123-fast-page-load',
                selectors: ['.s123-js-pjax', '#s123PjaxMainContainer', '#top-menu', "#top-menu-mobile"],
                scrollRestoration: true,
                cacheBust: false
            });
            that._p._handleResponse = that._p.handleResponse;
            that._p.handleResponse = function(responseText, request, href, options) {
                if (request.status == 404) window.location.href = request.responseURL;
                var browsedPageType = that.getBrowsedPageType(request.responseText);
                that.htmlTagClassesHandler(browsedPageType);
                if (request.responseText.match("<html")) {
                    that._p._handleResponse(responseText, request, href, options);
                } else {}
            }
            that.active = true;
        }, pjax_hash_delay);
    };
    that.refresh = function() {
        if (!that.active) return;
        that._p.refresh();
    };
    that.htmlTagClassesHandler = function(browsedPageType) {
        var homepage_html_classes = 'home_page home_page_design';
        var insidepage_html_classes = 'inside_page inside_page_header_design';
        var richpage_html_classes = 'rich_page home_page inside_page_header_design';
        if (browsedPageType.isHomepage && !browsedPageType.isRichpage) {
            $('html').removeClass(insidepage_html_classes);
            $('html').removeClass(richpage_html_classes);
            $('html').addClass(homepage_html_classes);
        } else if (browsedPageType.isRichpage) {
            $('html').removeClass(homepage_html_classes);
            $('html').removeClass(insidepage_html_classes);
            $('html').addClass(richpage_html_classes);
        } else {
            $('html').removeClass(homepage_html_classes);
            $('html').removeClass(richpage_html_classes);
            $('html').addClass(insidepage_html_classes);
        }
        popupWinScrollAction(0);
    };
    that.breadcrumbInitialize = function() {
        $('.breadcrumb-wrap .breadcrumb.container').find('a').addClass('s123-fast-page-load');
    };
    that.getBrowsedPageType = function(str) {
        var browsedPageType = {};
        str = str.substring(str.indexOf('<html'));
        str = str.substr(0, str.indexOf('>') + 1);
        browsedPageType.isHomepage = str.indexOf('home_page') !== -1;
        browsedPageType.isRichpage = str.indexOf('rich_page') !== -1;
        return browsedPageType;
    };
    that.isDataPage = function(str) {
        var $str = $(str);
        return $str.find('.s123-page-data').length > 0;
    };
    that.handleHashInUrl = function() {
        if (window.location.hash.length === 0) return;
        var $hash_element = $(window.location.hash);
        if ($hash_element.length === 0) return;
        $('html, body').scrollTop($(window.location.hash).offset().top - $('#mainNavMobile').outerHeight());
    };
    that.triggerComplete = function() {
        $(document).trigger('s123.pjax.complete');
    }
    that.triggerSend = function() {
        $(document).trigger('s123.pjax.send');
    }
    return that;
}();

function getImageWRV1(size, path) {
    if (!size || !path) return path;
    var ext = path.split('.').pop();
    if (ext === 'svg') return path;
    return path.replace('normal_', size + '_');
}

function tryParseJSON(str) {
    try {
        var Obj = JSON.parse(str);
        if (Obj && typeof Obj === "object") {
            return Obj;
        }
    } catch (e) {}
    return false;
}

function generateSharingPopoverHTML(popOverTitle, url, title) {
    html = '<div class="share-reply-buttons">';
    html += '<div class="share-reply-title" style="margin-bottom: 10px;">';
    html += '<span><b>' + popOverTitle + '</b></span>';
    html += '</div>';
    html += '<div class="share-reply-buttons" style="margin-bottom: 10px;">';
    html += '<input class="form-control sharing-url" style="cursor: text" type="text" value="' + decodeURIComponent(url) + '" readonly="">';
    html += '</div>';
    html += '<ul class="share-buttons square">';
    html += '<li style="margin-right: 5px;"><a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=' + url + '&t=' + title + '" title="Share on Facebook" target="_blank">' + S123.s123IconToSvg.getHtml('facebook', '', '') + '</a></li>';
    html += '<li style="margin-right: 5px;"><a class="btn" href="https://twitter.com/intent/tweet?source=' + url + '&text=' + title + ':%20' + url + '" target="_blank" title="Tweet">' + S123.s123IconToSvg.getHtml('twitter', '', '') + '</a></li>';
    html += '<li style="margin-right: 5px;"><a class="btn" href="mailto:?to=&subject=' + title + '&body=' + url + '">' + S123.s123IconToSvg.getHtml('envelope', '', '') + '</a></li>';
    html += '<li><button type="button" class="close">&times;</button></li>';
    html += '</ul>';
    html += '</div>';
    return html;
}

function sharePopover($button, html) {
    var $html = $(html);
    var $sharingURL = $html.find('.share-reply-buttons .sharing-url');
    var clipboard = new Clipboard('.popover.share-reply .share-reply-buttons .sharing-url', {
        target: function() {
            return document.querySelector('.popover.share-reply .share-reply-buttons .sharing-url');
        }
    });
    $sharingURL.click(function() {
        $.gritter.add({
            title: translations.linkCopiedToClipboard,
            class_name: 'gritter-success',
            time: 6000
        });
    })
    $button.popover({
        container: 'body',
        html: 'true',
        content: $html,
        trigger: 'manual',
        template: '<div class="popover share-reply" role="tooltip" style="max-width: 100%;"><div class="arrow"></div><div class="popover-content"></div></div>',
        placement: function(popover, button) {
            return isMobile.any() ? 'auto' : 'top';
        }
    });
    $button.popover('show');
    $button.on('shown.bs.popover', function() {
        $html.find('button').on('click', function() {
            destroySharePopover();
        });
        $(document).on('mousedown.shareDestroyPopover', function(event) {
            if ($(event.target).closest('.popover.share-reply').length === 0) {
                destroySharePopover();
            }
        });
    });

    function destroySharePopover() {
        $button.popover('destroy');
        $(document).off('mousedown.shareDestroyPopover');
        $(window).off('blur.shareDestroyPopover');
        $(window).off('scroll.shareDestroyPopover');
    }
}

function Google_reCaptcha(reCaptcha) {
    grecaptcha.ready(function() {
        grecaptcha.render({
            'sitekey': '6LcICoEUAAAAACB-cKbhks2djWsryQxVdJe1eYBi',
            'callback': reCaptcha.callback,
            'action': reCaptcha.action
        });
        grecaptcha.execute();
    });
}

function showPrice(currency, price) {
    if (!$.isNumeric(price)) return html;
    if (currency.symbolFirst) {
        var html = '<span data-rel="multiCurrency" dir="ltr"><span data-type="symbol">' + currency.symbol + '</span><span data-type="price">' + price + '</span></span>';
    } else {
        var html = '<span data-rel="multiCurrency" dir="ltr"><span data-type="price">' + price + '</span><span data-type="symbol">' + currency.symbol + '</span></span>';
    }
    return html;
}

function FitHomepageTextToWebsiteScreenWidth() {
    $(document).on('s123.page.ready.FitHomepageTextToWebsiteScreenWidth', function(event) {
        FitHomepageTextToWebsiteScreenWidth_action('home_siteSlogan');
        FitHomepageTextToWebsiteScreenWidth_action('home_siteSlogan_2');
        FitHomepageTextToWebsiteScreenWidth_action('home_SecondSiteSlogan');
    });
}

function FitHomepageTextToWebsiteScreenWidth_action(textEle) {
    var i = 0;
    var bodyWidth = $('body').width() - 50;
    var $textEle = $('#' + textEle);
    if ($textEle.length === 0) return;
    $textEle.css('font-size', '');
    if (whatScreen.any() == 'desktop') return;
    while (bodyWidth < $textEle.containerTextWidth_site123($textEle.css('font-size')) && i <= 50) {
        var fontSize = parseInt($textEle.css('font-size'), 10);
        fontSize = fontSize - 5;
        if (fontSize > 0) {
            $textEle.css('font-size', fontSize + 'px');
        } else {
            break;
        }
        i++;
    }
}
$.fn.containerTextWidth_site123 = function(fontSize) {
    var $this = $(this);
    if ($this.length === 0) return;
    var bodyWidth = $('body').width() - 50;
    var fontFamily = $this.css('font-family').replace('"', '\'');
    var html_calc = '<div id="containerTextWidth_site123" style="position:absolute;opacity:0;width:' + bodyWidth + 'px;display:table;font-size:' + fontSize + ';letter-spacing: ' + $this.css('letter-spacing') + ';line-height: ' + $this.css('line-height') + ';word-wrap: ' + $this.css('word-wrap') + ';white-space: ' + $this.css('white-space') + ';font-family: ' + fontFamily + ';">' + $this.html() + '</div>';
    $('body').append(html_calc);
    var width = $('#containerTextWidth_site123').width();
    $('#containerTextWidth_site123').remove();
    return width;
};
var s123MobileMenu = new function() {
    var that = this;
    that.init = function(settings) {
        $(document).on('s123.page.ready', function(event) {
            that.isRtl = $('html').attr('dir') === 'rtl' ? true : false;
            that.poupID = 'popupFloatDivMenu';
            that.animation = 400;
            that.isOpened = false;
            $('.header-menu-wrapper .mobile-menu-btn').off('click').click(function() {
                var $this = $(this);
                that.$source = $('#top-menu-mobile > ul').clone();
                that.closeLocation = $this.data('closeLocation');
                that.menuType = $this.data('menu-type');
                that.isMobile = $this.data('is-mobile');
                that.menuColor = $this.attr('data-menu-color');
                if (!that.$source) return;
                openMenu();
                that.$container = $('#popupFloatDivMenu');
                that.$page = that.$container.find('.page');
                that.$ul = that.$container.find('.navPagesPopup');
                that.$navPagesPopupActionButtons = that.$container.find('.navPagesPopupActionButtons');
                that.$categories = that.$container.find('.moduleMenu.dropdown-submenu > a');
                that.$container.addClass(that.menuColor);
                that.$categories.removeClass('page-scroll');
                dropdownClickFlag = 1;
                that.createCategoryOnClick();
                addPajaxSupport();
                addPopupCustomEvents();
            });
        });
    };

    function addPajaxSupport() {
        that.$ul.find('a').each(function() {
            var $this = $(this);
            if ($this.parent().hasClass('dropdown-submenu')) return;
            if ($this.attr('target') == '_blank') return;
            $this.addClass('s123-fast-page-load');
        });
        S123.Pjax.refresh();
    }

    function addPopupCustomEvents() {
        setTimeout(function() {
            var navHeight = $('#popupFloatDivMenu .navPagesPopup').outerHeight(true) + 100;
            var actionHeight = $('.navPagesPopupActionButtons').outerHeight(true);
            var screenHeight = $('#popupFloatDivMenu .page').outerHeight(true);
            if (navHeight + actionHeight > screenHeight) {
                $('#popupFloatDivMenu .navPagesPopup').height(screenHeight - actionHeight - 15);
            } else {
                $('#popupFloatDivMenu .navPagesPopup').height(navHeight - 15);
            }
            $('#popupFloatDivMenu .navPagesPopup .site-dropdown-menu').css('opacity', '1');
        }, 150);
        activeDropDownMenusAction();
        $('#popupFloatDivMenu .navPagesPopup li').not('.dropdown-submenu').find('a').click(function() {
            buildPopup_CloseAction('popupFloatDivMenu');
        });
        $('#popupFloatDivMenu .navPagesPopupActionButtons_part2 a').click(function() {
            buildPopup_CloseAction('popupFloatDivMenu');
        });
        ActivePopupActionButtonsInPage();
        $(document).trigger('s123.page.ready.pageScrollByClick');
        $(document).trigger('s123.page.ready.ActiveLanguageButton');
    }
    that.createCategoryOnClick = function() {
        that.$categories.each(function() {
            var $this = $(this);
            if ($this.parent().children('.site-dropdown-menu').length === 0) return;
            $this.off('click.mobile_categories').on('click.mobile_categories', function(e) {
                e.preventDefault();
                e.stopPropagation();
                that.contentOffset = $(window).width();
                $this.parent().addClass('selected-category');
                if (!$this.hasClass('active-cat')) {
                    that.menuHeight = that.$ul.outerHeight();
                    that.menuTop = that.$ul.offset().top - $(window).scrollTop();
                    var menuModuleId = $this.parent().data('menu-module-id');
                    that.$selectedCat = $this.closest('.navPagesPopup').clone();
                    that.$selectedCat.children().each(function(index, page) {
                        if ($(page).data('menu-module-id') != menuModuleId || !$(page).hasClass('selected-category')) {
                            $(page).remove();
                        } else {
                            $(page).find('.site-dropdown-menu').addClass('demo-ul');
                        }
                    });
                    replaceDemoContentWithOriginal(menuModuleId);
                    that.$selectedCat.css('overflow', 'hidden');
                    openCategory();
                    animate('show');
                    screenResizeHandler();
                }
            });
        });
    };

    function replaceDemoContentWithOriginal(menuModuleId) {
        var $selectedCategory = that.$selectedCat.children().first();
        var $categoryPages = null;
        var $category = $selectedCategory.children('a');
        $category.addClass('active-cat');
        if (IsIE11()) {
            $category.prepend('<span class="close-cat fa fa-caret-' + (that.isRtl ? 'right' : 'left') + '">&nbsp</span>');
            $category.children('span').last().remove();
        } else {
            $category.prepend(S123.s123IconToSvg.getHtml('caret-' + (that.isRtl ? 'right' : 'left'), 'close-cat', '') + '&nbsp');
            $category.children('i').last().remove();
        }
        that.$categoryPagesParent = that.$ul.find('li[data-menu-module-id="' + menuModuleId + '"].dropdown-submenu.selected-category');
        $selectedCategory.find('.demo-ul').replaceWith(that.$categoryPagesParent.children('.site-dropdown-menu'));
        $categoryPages = $selectedCategory.find('.site-dropdown-menu');
        $categoryPages.addClass('fancy-scrollbar');
        $categoryPages.addClass('active-cat-content');
        $categoryPages.css('max-height', that.menuHeight - 50 + 'px');
    }

    function animate(action, callBack) {
        var animation = {
            ul: {},
            openedCat: {}
        };
        var $categoryPages = that.$selectedCat.find('.active-cat-content');
        that.contentOffset = $(window).width();
        addRemoveAnimationClass('add', [$categoryPages, that.$container, that.$page, that.$ul, that.$selectedCat]);
        if (action == 'show') {
            that.$tmpDiv = $('<div style="width:100%;height:' + that.$ul.height() + 'px; margin-bottom:10px;"></div>');
            that.$ul.parent().prepend(that.$tmpDiv);
            if (that.isRtl) {
                that.$selectedCat.css({
                    position: 'absolute',
                    top: that.menuTop,
                    right: that.contentOffset,
                    height: that.menuHeight
                });
                animation.openedCat.right = ($(window).width() - (that.$page.offset().left + that.$page.outerWidth())) + 5;
                that.$ul.css({
                    position: 'absolute',
                    top: that.menuTop,
                    right: ($(window).width() - (that.$page.offset().left + that.$page.outerWidth())) + 5,
                    fontFamily: 'auto',
                    height: that.menuHeight,
                    zIndex: 1 // edge bug fix - element is disappears without z-index
                });
                animation.ul.right = that.contentOffset * -1;
            } else {
                that.$selectedCat.css({
                    position: 'absolute',
                    top: that.menuTop,
                    left: that.contentOffset,
                    height: that.menuHeight
                });
                animation.openedCat.left = that.$page.offset().left + 5;
                that.$ul.css({
                    position: 'absolute',
                    top: that.menuTop,
                    left: that.$page.offset().left + 5,
                    fontFamily: 'auto',
                    height: that.menuHeight,
                    zIndex: 1 // edge bug fix - element is disappears without z-index
                });
                animation.ul.left = that.contentOffset * -1;
            }
            that.$ul.parent().prepend(that.$selectedCat);
            that.$selectedCat.stop().animate(animation.openedCat, that.animation, function() {
                that.$selectedCat.css({
                    position: ''
                });
                addRemoveAnimationClass('remove', [$categoryPages, that.$selectedCat, that.$container, that.$page]);
                that.$tmpDiv.remove();
                that.$ul.css({
                    fontFamily: ''
                });
            });
            that.$ul.stop().animate(animation.ul, that.animation);
            that.isOpened = true;
        } else if (action == 'hide') {
            if (that.isRtl) {
                animation.ul.right = ($(window).width() - (that.$page.offset().left + that.$page.outerWidth())) + 5;
                animation.openedCat.right = that.contentOffset;
            } else {
                animation.ul.left = that.$page.offset().left + 5;
                animation.openedCat.left = that.contentOffset;
            }
            addRemoveAnimationClass('add', [$categoryPages]);
            that.$selectedCat.css({
                position: 'absolute'
            });
            that.$tmpDiv = $('<div style="height:' + that.$selectedCat.height() + 'px; margin-bottom:10px;"></div>');
            that.$ul.parent().prepend(that.$tmpDiv);
            that.$selectedCat.stop().animate(animation.openedCat, that.animation, function() {
                $categoryPages.removeClass();
                $categoryPages.addClass('site-dropdown-menu');
                $categoryPages.appendTo(that.$categoryPagesParent);
                that.$selectedCat.remove();
            });
            that.$ul.stop().animate(animation.ul, that.animation, function() {
                that.$ul.css({
                    position: '',
                    height: that.menuHeight
                });
                if (callBack) callBack.call(this);
                addRemoveAnimationClass('remove', [that.$container, that.$page, that.$ul]);
            });
            that.$ul.children('.selected-category').removeClass('selected-category');
            that.isOpened = false;
        }
    }

    function openCategory() {
        var $category = that.$selectedCat.find('.active-cat');
        var $subCat = that.$selectedCat.find('.site-dropdown-menu');
        that.ulPrevState = that.$ul.scrollTop();
        $category.closest('li').addClass('active').addClass('open');
        resetBackButtonEvent($category);
        $category.closest('li').siblings().hide();
    }

    function resetBackButtonEvent($category) {
        that.$selectedCat.find('.active-cat').on('click.mobile_categories_back', function(event) {
            event.preventDefault();
            animate('hide', function() {
                hideCategory($category);
            });
        });
    }

    function hideCategory($category) {
        $category.parent('.dropdown-submenu').removeClass('active').removeClass('open');
        that.$selectedCat.find('.active-cat').off('click.mobile_categories_back');
        $category.parent().siblings().show();
        that.$tmpDiv.remove();
        that.$ul.scrollTop(that.ulPrevState);
    }

    function generateHTML() {
        if (IsIE11()) {
            that.$source.find('.dropdown-submenu a > span:not(.txt-container)').removeClass('fa-caret-down')
                .addClass('fa-caret-' + (that.isRtl ? 'left' : 'right'));
        } else {
            that.$source.find('.dropdown-submenu a > i.s123-icon-converter').replaceWith(S123.s123IconToSvg.getHtml('caret-' + (that.isRtl ? 'left' : 'right'), '', ''));
        }
        var html = '<ul class="navPagesPopup fancy-scrollbar">' + that.$source.html() + '</ul>';
        html += '<div class="navPagesPopupActionButtons">';
        html += '<div class="navPagesPopupActionButtons_part1">';
        if ($('.header-address-wrapper').length > 0) {
            html += $('.header-address-wrapper').clone().html();
        }
        if ($('.header-social-wrapper').length > 0 && $('.header-social-wrapper.hidden').length == 0) {
            html += $('.header-social-wrapper').clone().html();
        }
        if ($('.header-search-wrapper').length > 0) {
            html += $('.header-search-wrapper').clone().html();
        }
        if ($('.website-languages-menu a').length > 0) {
            html += $('.website-languages-menu').clone().html();
        }
        if ($('.header-m-c-wrapper').length > 0) {
            html += MultiCurrencies.getMobileIconHtml();
        }
        if ($('#mainNavMobile .header-email-wrapper').length > 0) {
            html += $('#mainNavMobile .header-email-wrapper').clone().html();
        }
        if ($('#mainNavMobile .header-phone-wrapper').length > 0) {
            html += $('#mainNavMobile .header-phone-wrapper').clone().html();
        }
        if ($('.header-client-zone-wrapper a').length > 0) {
            html += $('.header-client-zone-wrapper').clone().html();
        }
        html += '</div>';
        if ($('.action-button-wrapper').length > 0) {
            html += '<div class="navPagesPopupActionButtons_part2">';
            $('.action-button-wrapper').each(function() {
                var $this = $(this);
                html += $this.clone().html();
            });
            html += '</div>';
        }
        html += '</div>';
        return html;
    }

    function openMenu() {
        var customClass = '';
        var addCustomCover = false;
        switch (that.menuType) {
            case 0:
                customClass = '';
                break;
            case 1:
                customClass = 'side-menu';
                addCustomCover = true;
                break;
            case 2:
                customClass = 'side-menu half-width';
                addCustomCover = true;
                break;
        }
        if (that.isMobile) {
            customClass += ' is-mobile';
        }
        buildPopup(that.poupID, '', generateHTML(), '', true, true, true, that.closeLocation, customClass);
        if (addCustomCover) {
            var $customCover = $('#' + that.poupID).find('.cover').clone(true, false);
            $customCover.removeClass('cover');
            $customCover.addClass('custom-menu-cover');
            $('#' + that.poupID).append($customCover);
        }
    }

    function screenResizeHandler() {
        $(window).off('resize.mobile_menu').on('resize.mobile_menu', function() {
            that.contentOffset = $(window).width();
            that.menuHeight = that.$page.height() - that.$navPagesPopupActionButtons.outerHeight() - 10;
            that.menuTop = that.$ul.offset().top - $(window).scrollTop();
            that.$ul.css({
                height: that.menuHeight
            });
            if (that.isOpened) {
                that.menuTop = that.$selectedCat.offset().top - $(window).scrollTop();
                that.$ul.css({
                    top: that.menuTop,
                    height: that.menuHeight
                });
                that.$selectedCat.css({
                    top: that.menuTop,
                    height: that.menuHeight
                });
                that.$selectedCat.find('.active-cat-content').css({
                    maxHeight: that.menuHeight
                });
                if (that.isRtl) {
                    that.$ul.css({
                        right: that.contentOffset * -1
                    });
                } else {
                    that.$ul.css({
                        left: that.contentOffset * -1
                    });
                }
            }
        });
    }

    function addRemoveAnimationClass(action, elements) {
        switch (action) {
            case 'add':
                for (var i = 0; i < elements.length; i++) {
                    elements[i].addClass('m-m-progress');
                }
                break;
            case 'remove':
                for (var i = 0; i < elements.length; i++) {
                    elements[i].removeClass('m-m-progress');
                }
                break;
        }
    }
    return that;
}();

function moduleLayoutCategories_shadow() {
    $(document).on('s123.page.ready', function(event) {
        $.each($('.s123-module .s123-categories'), function() {
            var $this = $(this);
            var $categoriesContainer = $this.find('ul');
            var $mrsFirst = $('<div class="m-r-s"></div>');
            var $mrsLast = $('<div class="m-r-s"></div>');
            $this.prepend($mrsFirst);
            $this.append($mrsLast);
            if ($this.closest('.s123-module-gallery').length > 0 && !$this.hasClass('col-xs-12')) {
                $mrsFirst.css({
                    left: 0
                });
                $mrsLast.css({
                    right: 0
                });
            }
        });
    });
}
var ProgressveWebApp = new function() {
    var that = this;
    that.init = function() {
        $(document).on('s123.page.load.progressve_web_app', function(event) {
            if (typeof pwaSettings === 'undefined') return;
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js');
            }
            if (!pwaSettings.enableMessage) {
                window.addEventListener('beforeinstallprompt', function(e) {
                    e.preventDefault();
                });
            }
        });
    };
    return that;
}();

function s123InfiniteScroll(settings) {
    var that = {};
    that.init = function() {
        that.$container = settings.$container;
        that.ajax = settings.ajax;
        that.inProgress = false;
        that.pageNum = 2;
        that.initilized = false;
        that.disabled = false;
        that.id = settings.id;
        that.offset = settings.offset;
        that.loader = settings.loader;
        that.$loading = $(generateHtml());
        that.$container.parent().append(that.$loading);
        that.addLoadNextPageAbility();
        that.initilized = true;
        that.$container.data('s123InfiniteScroll', that);
    };
    that.addLoadNextPageAbility = function() {
        $(window).off('scroll.s123InfiniteScroll' + that.id).on('scroll.s123InfiniteScroll' + that.id, function() {
            if (that.disabled) return;
            if ($(window).scrollTop() + $(window).height() >= that.$container.height() - that.offset) {
                that.getPage();
                that.inProgress = true;
            }
        });
    };
    that.destroy = function() {
        $(window).off('scroll.s123InfiniteScroll' + that.id);
        that.$loading.remove();
        if (that.request) that.request.abort();
    };
    that.getPage = function() {
        if (that.inProgress) return;
        showLoadingAnimation();
        that.ajax.data.pageNumber = that.pageNum;
        that.request = $.ajax({
            type: that.ajax.type,
            url: that.ajax.url,
            data: that.ajax.data,
            success: function(data) {
                data = tryParseJSON(data);
                that.pageNum++;
                that.inProgress = false;
                hideLoadingAnimation();
                if (!data.hasNextPage) {
                    that.destroy();
                }
                if (that.ajax.success) that.ajax.success.call(this, data);
                that.request = null;
            }
        });
    };
    that.disable = function() {
        that.disabled = true;
    };
    that.enable = function() {
        that.disabled = false;
    };

    function generateHtml() {
        var html = '';
        html += '<div class="wizard-pagination text-center" style="display:none; width: 100%; padding: 10px;">';
        html += '<div class="loading-icon" style="width:100%;">';
        html += '<div class="s123-loader-ellips infinite-scroll-request">';
        html += '<span class="s123-loader-ellips__dot"></span>';
        html += '<span class="s123-loader-ellips__dot"></span>';
        html += '<span class="s123-loader-ellips__dot"></span>';
        html += '<span class="s123-loader-ellips__dot"></span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    function showLoadingAnimation() {
        if (that.loader) {
            for (var i = 0; i < that.ajax.data.limit; i++) {
                var $template = $(that.loader.template);
                $template.addClass('w-i-s-fake');
                that.loader.$container.append($template);
            }
        } else {
            that.$loading.show();
        }
    }

    function hideLoadingAnimation() {
        if (that.loader) {
            that.loader.$container.find('.w-i-s-fake').remove();
        } else {
            that.$loading.hide();
        }
    }
    that.init();
    return that;
}

function IsIE11() {
    return !!window.MSInputMethodContext && !!document.documentMode;
}
S123.popOver = function() {
    var that = {};
    that.init = function(settings) {
        if (!settings) return;
        if (settings.$el.length === 0) return;
        that.$el = settings.$el;
        that.elSelector = settings.elSelector;
        that.namespace = settings.namespace;
        that.oneTimeUsage = settings.oneTimeUsage;
        that.popOverSettings = settings.popOverSettings;
        that.$el.popover({
            selector: that.popOverSettings.selector,
            content: that.popOverSettings.content,
            html: that.popOverSettings.html,
            trigger: that.popOverSettings.trigger,
            template: that.popOverSettings.template,
            placement: function(popover, input) {
                if (that.popOverSettings.placementCallBack) {
                    return that.popOverSettings.placementCallBack.call(this);
                } else {
                    return 'auto';
                }
            }
        });
        that.$el.on('shown.bs.popover', function(event) {
                that.popOverSettings.content.find('[data-menu-dismiss="popover"]').click(function(event) {
                    if (that.oneTimeUsage) {
                        destroy();
                    } else {
                        hide();
                    }
                });
                $(window).on('mousedown.destroyPopover' + '.' + that.namespace, function(event) {
                    if (that.popOverSettings.trigger === 'manual' && $(event.target).closest(that.elSelector).length > 0) return;
                    if ($(event.target).closest('.' + that.selector).length === 0) {
                        if (that.oneTimeUsage) {
                            destroy();
                        } else {
                            hide();
                        }
                    }
                });
                $(window).one('blur.destroyPopover' + '.' + that.namespace, function(event) {
                    if (that.popOverSettings.trigger === 'manual' && $(event.target).closest(that.elSelector).length > 0) return;
                    if (that.oneTimeUsage) {
                        destroy();
                    } else {
                        hide();
                    }
                });
                $(document).trigger('s123_pop_over_wrapper.shown' + '.' + that.namespace);
            })
            .on('show.bs.popover', function(event) {
                $(document).trigger('s123_pop_over_wrapper.show' + '.' + that.namespace);
            })
            .on('hide.bs.popover' + '.' + that.namespace, function(event) {
                $(document).trigger('s123_pop_over_wrapper.hide' + '.' + that.namespace);
            });
    };

    function hide() {
        that.$el.popover('hide');
        $(window).off('mousedown.destroyPopover' + '.' + that.namespace);
        $(window).off('blur.destroyPopover' + '.' + that.namespace);
        $(window).off('scroll.destroyPopover' + '.' + that.namespace);
    }

    function destroy() {
        that.$el.popover('destroy');
        $(window).off('mousedown.destroyPopover' + '.' + that.namespace);
        $(window).off('blur.destroyPopover' + '.' + that.namespace);
        $(window).off('scroll.destroyPopover' + '.' + that.namespace);
    }
    return that;
}();
S123.globalContactEmail = function() {
    var that = {};
    that.init = function() {
        that.emailBtns = $('[data-toggle="email_menuCallActionIcons"]');
        that.settings = tryParseJSON($('#globalContactEmailSettings').val());
        that.custom_form_html = that.settings.custom_form_html ? that.settings.custom_form_html : '';
        that.emailBtns.off('click').click(function() {
            var $this = $(this);
            var $header_email_content = $('#header-email-content').clone();
            if (IsWizard() && $this.closest('.s123-module-contact').length !== 0) return;
            if ($header_email_content.find('a').text().length > 20) {
                $header_email_content.find('.global-contact-details-container').addClass('g-c-d-long-text-handler');
            }
            buildPopup('popupFloatDivSearch', '', that.buildEmailToolForm(), '', true, true, true, $this.data('closeLocation'), '');
            S123.globalContactEmail.submitHandler();
            $(document).trigger('s123.page.ready.wizard_preview_manage_helpers');
        });
    };
    that.buildEmailToolForm = function() {
        var html = '';
        html += '<div class="global-contact-email-container">';
        html += '<div class="g-c-email-info-box">';
        html += '<h3>' + translations.globalContactEmail.contactUs + '</h3>';
        html += '<p>' + translations.globalContactEmail.infoBox.replace('{{email_address}}', '<a href="mailto:' + that.settings.contact_email + '">' + that.settings.contact_email + '</a>') + '</p>';
        html += '</div>';
        html += '<form class="g-c-email-form">';
        if (that.custom_form_html.length !== 0) {
            html += that.custom_form_html;
            html += '<input type="hidden" name="useCustomForm" value="1">';
        } else {
            html += '<div class="row">';
            html += '<div class="col-sm-6 col-xs-12">';
            html += '<div class="form-group">';
            html += '<label for="emailForm_fullName" class="white">' + translations.globalContactEmail.fullName + '</label>';
            html += '<input type="text" name="emailForm_fullName" placeholder="' + translations.globalContactEmail.fullName + '" class="form-control" required data-msg-required="' + translations.jqueryValidMsgRequire + '">';
            html += '</div>';
            html += '</div>';
            html += '<div class="col-sm-6 col-xs-12">';
            html += '<div class="form-group">';
            html += '<label for="emailForm_email" class="white">' + translations.emailAddress + '</label>';
            html += '<input type="text" name="emailForm_email" placeholder="' + translations.emailAddress + '" class="form-control" required data-msg-required="' + translations.jqueryValidMsgRequire + '" data-rule-email="true" data-msg-email="' + translations.jqueryValidMsgEmail + '">';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '<div class="row">';
            html += '<div class="col-xs-12">';
            html += '<div class="form-group">';
            html += '<label for="emailForm_description" class="white">' + translations.globalContactEmail.description + '</label>';
            html += '<textarea class="form-control" name="emailForm_description" rows="4" placeholder="' + translations.globalContactEmail.description + '"></textarea>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
        html += '<div class="row">';
        html += '<div class="col-xs-12">';
        html += '<button type="submit" class="btn btn-primary btn-block">' + translations.send + '</button>';
        html += '<input type="hidden" name="websiteID" value="' + $('#websiteID').val() + '">';
        html += '<input type="hidden" name="w" value="' + $('#w').val() + '">';
        html += '</div>';
        html += '</div>';
        html += '</form>';
        html += '<div class="g-c-email-message-sent-box">';
        html += '<div class="row">';
        html += '<div class="col-sm-6 col-xs-12 col-md-offset-3">';
        html += '<h3 class="g-c-email-message-content">' + translations.globalContactEmail.thankYouMessage + '</h3>';
        html += '</div>';
        html += '</div>';
        html += '<div class="row">';
        html += '<div class="col-sm-6 col-xs-12 col-md-offset-3">';
        html += '<button type="button" class="btn btn-primary close-order-thank-you">' + translations.globalContactEmail.thankYouCloseBtn + '</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html;
    };
    that.submitHandler = function() {
        var $form = $('.g-c-email-form');
        $form.validate({
            errorElement: 'div',
            errorClass: 'help-block',
            focusInvalid: true,
            ignore: "",
            highlight: function(e) {
                $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
            },
            success: function(e) {
                $(e).closest('.form-group').removeClass('has-error');
                $(e).remove();
            },
            submitHandler: function(form) {
                var $form = $(form);
                $form.find('button:submit').prop('disabled', true);
                $.ajax({
                    type: "POST",
                    url: "/versions/" + $('#versionNUM').val() + "/include/contactEmailO.php",
                    data: $form.serialize(),
                    success: function(data) {
                        $form.trigger("reset");
                        $form.addClass("hidden");
                        $(".g-c-email-message-sent-box").show();
                        $(".g-c-email-info-box").hide();
                        $form.next().find(".close-order-thank-you").on("click", function() {
                            buildPopup_CloseAction('popupFloatDivSearch');
                        });
                        $form.find('button:submit').prop('disabled', false);
                        WizardNotificationUpdate();
                    }
                });
                return false;
            }
        });
    };
    return that;
}();

function previewScaleDeviceTypeChange(deviceType) {
    $(document).trigger('previewScale.deviceTypeChange', [deviceType]);
}

function CustomFormMultiSteps() {
    var that = this;
    that.init = function(settings) {
        that.totalSteps = settings.totalSteps;
        that.$form = settings.$form;
        that.$nextButton = settings.$nextButton;
        that.$submitButton = settings.$submitButton;
        that.$previousButton = settings.$previousButton;
        that.initMultiStepsButtons();
    };
    that.initMultiStepsButtons = function() {
        that.$previousButton.off('click').on('click', function() {
            var $step = that.$form.find('.custom-form-step:visible');
            var step = $step.data('step');
            var previousStep = step - 1;
            $step.hide();
            that.$form.find('.custom-form-step.step-' + previousStep).fadeIn(350);
            that.$submitButton.hide();
            that.$nextButton.fadeIn(350);
            if (previousStep < 2) {
                that.$previousButton.hide();
            } else {
                that.$previousButton.fadeIn(350);
            }
        });
        that.$nextButton.off('click').on('click', function() {
            var $step = that.$form.find('.custom-form-step:visible');
            var step = $step.data('step');
            var nextStep = step + 1;
            if (!that.$form.valid()) return;
            var offset = findBootstrapEnvironment() != 'xs' ? menuScrollOffset : menuScrollOffset_mobile;
            var isScrollTopForm = that.$form.offset().top - offset < $(window).scrollTop();
            $step.hide();
            that.$form.find('.custom-form-step.step-' + nextStep).fadeIn(350);
            that.$previousButton.css('display', 'block');
            if (nextStep >= that.totalSteps) {
                that.$nextButton.hide();
                that.$submitButton.fadeIn(350);
            }
            if (that.$form.offset().top - offset < $(window).scrollTop()) {
                $('html, body').stop().animate({
                    scrollTop: (that.$form.offset().top - offset)
                }, 1250, 'easeInOutExpo');
            }
        });
    }
    that.reset = function() {
        that.$form.find('.custom-form-step').hide();
        that.$previousButton.hide();
        that.$submitButton.hide();
        that.$form.find('.step-1').fadeIn(350);
        that.$nextButton.fadeIn(350);
    };
}
S123.ButtonLoading = function() {
    var that = {};
    that.start = function($button) {
        if ($button.find('.s123-btn-loading').length > 0) return;
        var html = $button.html();
        $button.html('<div class="s123-btn-loading"><span class="s123-btn-loading-text">' + html + '</span>' + S123.s123IconToSvg.getHtml('spinner', 'fa-spin white', '') + '</div>');
    }
    that.stop = function($button) {
        if ($button.find('.s123-btn-loading').length == 0) return;
        $button.html($button.find('.s123-btn-loading-text').html());
    }
    return that;
}();

function Forms_GoogleRecaptcha() {
    var that = this;
    that.init = function($form) {
        that.isActive = false;
        if ($('#w').val().length != 0) return;
        that.$form = $form;
        that.$inputs = that.$form.find('input, textarea, select');
        that.$recaptchaToken = that.$form.find('input[name="recaptchaToken"]');
        window.isGoogleRecaptchaLoaded = false;
        that.isGotToken = false;
        that.isActive = true;
        that.$inputs.on('focus', function() {
            var isUsingMagicButtons = $('html[dir="ltr"] .all-magic-buttons .m-btn-c').length > 0;
            if (!window.isGoogleRecaptchaLoaded) {
                window.isGoogleRecaptchaLoaded = true;
                $.getScript('https://www.google.com/recaptcha/api.js?render=6Lck3r0ZAAAAAOFc__oZANv72nZ3K29O-qsOIYPp').done(function() {
                    grecaptcha.ready(function() {
                        if (isUsingMagicButtons) {
                            $('.grecaptcha-badge').addClass('grecaptcha-badge-new-position');
                        }
                    });
                });
            } else {
                $('.grecaptcha-badge').removeClass('hide');
            }
        });
        that.$inputs.on('focusout', function() {
            $('.grecaptcha-badge').addClass('hide');
        });
    }
    that.getToken = function() {
        try {
            grecaptcha.ready(function() {
                grecaptcha.execute('6Lck3r0ZAAAAAOFc__oZANv72nZ3K29O-qsOIYPp', {
                        action: 'users_forms_submit'
                    })
                    .then(function(token) {
                        that.$recaptchaToken.val(token);
                        that.isGotToken = true;
                        that.$form.submit();
                    });
            });
        } catch (err) {
            that.$recaptchaToken.val('');
            that.isGotToken = true;
            that.$form.submit();
        }
    }
    that.reset = function() {
        that.isGotToken = false;
        window.isGoogleRecaptchaLoaded = false;
    };
}

function HomepageCountdown() {
    $(document).on('s123.page.ready', function(event) {
        var $section = $('#top-section');
        var $countdown = $section.find('#homepageCountdown');
        var $container = $section.find('.homepage-countdown-container');
        if ($countdown.length == 0) return;
        var countdownWidget = new CountdownWidget();
        countdownWidget.init({
            $countdown: $countdown,
            dateInfo: $countdown.data('date-info'),
            type: $countdown.data('type'),
            translate: {
                days: $countdown.data('days'),
                hours: $countdown.data('hours'),
                minutes: $countdown.data('minutes'),
                seconds: $countdown.data('seconds')
            },
            onStop: function() {
                $container.find('.message').fadeIn(350);
            }
        });
    });
}
S123.CrossOriginHandler = function() {
    var _ = {};
    _.init = function() {
        if ($('[data-rel="crossOriginHandler"]').length == 0) return;
        $(window).on('message.crossOriginHandler', function(event) {
            var data = event.originalEvent.data;
            switch (data.eventType) {
                case 'resize':
                    $('#' + data.id).css({
                        height: data.height
                    });
                    break;
            }
        });
    };
    return _;
}();