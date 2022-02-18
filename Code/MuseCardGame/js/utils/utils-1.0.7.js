var utils = {
    errorManager:{
        defaultErrorMessage:"",
        errorTag:"",
        
        setDefaultErrorMessage:function(errorMessage){
            this.defaultErrorMessage = errorMessage;
        },
        
        setDefaultErrorTag:function(tagId){
            this.errorTag = document.getElementById(tagId);
        },
        
        showError: function(errorContainerId,errorMessage){
            if(errorContainerId){
                var tag = document.getElementById(errorContainerId);
            }
            else{
                var tag = this.errorTag;
            }
            
            if(errorMessage){
                tag.textContent = errorMessage;
            }
            else{
                tag.textContent = this.defaultErrorMessage;
            }
            
        }  
    },
    
    browserManager:{
        getBrowser: function(){
            var matched, browser;
            
            // Use of jQuery.browser is frowned upon.
            // More details: http://api.jquery.com/jQuery.browser
            // jQuery.uaMatch maintained for back-compat
            jQuery.uaMatch = function( ua ) {
                ua = ua.toLowerCase();
                
                var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                        /(msie) ([\w.]+)/.exec( ua ) ||
                        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                        [];
                
                return {
                    browser: match[ 1 ] || "",
                    version: match[ 2 ] || "0"
                };
            };
            
            matched = jQuery.uaMatch( navigator.userAgent );
            browser = {};
            
            if ( matched.browser ) {
                browser[ matched.browser ] = true;
                browser.version = matched.version;
            }
            
            // Chrome is Webkit, but Webkit is also Safari.
            if ( browser.chrome ) {
                browser.webkit = true;
            } else if ( browser.webkit ) {
                browser.safari = true;
            }
            
            jQuery.browser = browser;
        },
        
        isChrome: function(){
            this.getBrowser();
            if(jQuery.browser.webkit){
                return true;
            }
        },
        
        isSafari: function(){
            this.getBrowser();
            if(jQuery.browser.safari){
                return true;
            }
        },
        
        isMozilla: function(){
            this.getBrowser();
            if(jQuery.browser.mozilla){
                return true;
            }
        },
        
        isUndetectedBrowser: function(){
            if(!this.isChrome() && !this.isMozilla() && !this.isSafari()){
                return true;
            }
        }
    },
    
    isMobile: function() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

          // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            //return "Windows Phone";
            return true;
        }

        if (/android/i.test(userAgent)) {
            //return "Android";
            return true;
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPhone/i.test(userAgent) && !window.MSStream) {
            //return "iOS";
            return true;
        }

        return false;
    },
    
    guiUtils: {
        isCloseToBottomOfPage: function(){
            // generally this method is used in this way
            //  $(window).scroll(function(){
            //       utils.guiUtils.isCloseToBottomOfPage();
            //  });
            if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
               return $(window).scrollTop();
            }

            return false;   
        },
        
        scrollToElement:function(selector,offset){
            if(!offset){
                offset = 0;
            }
            
            setTimeout(function(){
                if($(selector).length){
                        $('html, body').animate({
                            scrollTop: $(selector).offset().top + offset
                        }, 1000);
                }
            },100);
        },
        
        scrollToElementIfNotVisible:function(selector,offsetSpace){
            setTimeout(function(){
                if($(selector).length){
                    var currentScrollPosition = $(window).scrollTop();
                    var screenHeight = $(window).height();
                    var selectorTopPosition = $(selector).offset().top;
                    if( (selectorTopPosition + offsetSpace) > (currentScrollPosition + screenHeight) ){
                        $('html, body').animate({
                            scrollTop: currentScrollPosition + offsetSpace
                        }, 1000);
                    }
                }
            },100);
        },
        
        orderAlphabeticallyOptionsInSelectTag:function(selectId){
            var options = $('select#' + selectId + ' option');
            var arr = options.map(function(_, o) {
                return {
                    t: $(o).text(),
                    v: o.value
                };
            }).get();
            
            arr.sort(function(o1, o2) {
                return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
            });
            
            options.each(function(i, o) {
                o.value = arr[i].v;
                $(o).text(arr[i].t);
            });  
        },
        
        autoAdjustAllTextareaHeightInDocument:function(){
            var textareaList = document.getElementsByTagName("textarea");
            var length = textareaList.length;
            for(var i = 0; i < length; i++){
                this.autoAdjustTextareaHeight(textareaList[i]);
            }
        },
        
        autoAdjustTextareaHeight: function (element){
            var resizeTextarea = function(textarea){
                if(textarea.value === ""){
                    textarea.style.height = 40 + "px";
                }
                else{
                    textarea.style.height = "1px";
                    textarea.style.height = (15 + element.scrollHeight) + "px";
                }
            };
            
            element.addEventListener("keyup",function(){
                resizeTextarea(element);
            });
            
            resizeTextarea(element);
            element.style.overflow = "hidden";
        },
        
        areEqualDOMTrees: function(firstTree,secondTree){
            var firstTreeChilds = firstTree.childNodes;
            var secondTreeChilds = secondTree.childNodes;
            
            // if the number of childs of the two trees are different then the trees are different
            if(firstTreeChilds.length !== secondTreeChilds.length){
                return false;
            }
            else{
                //if there are no child nodes in both trees they are equal
                if(firstTreeChilds.length === 0 && secondTreeChilds.length === 0){
                    return true;
                }
                else{
                    var returnValue = true;
                    
                    // for all the child nodes decide what to return or call recursively the function
                    for(var i = 0; i < firstTreeChilds.length;i++){
                        if(returnValue !== false && firstTreeChilds[i].nodeType === secondTreeChilds[i].nodeType){
                            //if the node type is tag
                            if(firstTreeChilds[i].nodeType === 1){
                                if(firstTreeChilds[i].tagName === secondTreeChilds[i].tagName){
                                    if(firstTreeChilds[i].tagName.toUpperCase() === "INPUT"){
                                        if(firstTreeChilds[i].value === secondTreeChilds[i].value){
                                            return true;
                                        }
                                        else{
                                            return false;
                                        }
                                    }
                                    else{
                                        returnValue = this.areEqualDOMTrees(firstTreeChilds[i],secondTreeChilds[i]);
                                    }
                                }
                                else{
                                    //the tags are different i.e. the trees are different
                                    returnValue = false;
                                    break;
                                }
                            }
                            else if(firstTreeChilds[i].nodeType === 3){
                                //node type is text
                                returnValue = firstTreeChilds[i].textContent === secondTreeChilds[i].textContent;
                            }
                            else{
                                //node type is not text or tag
                                returnValue = true;
                            }
                        }
                        else{
                            //the tag type are different i.e. the trees are different
                            returnValue = false;
                            break;
                        }
                    }
                    
                    return returnValue;
                }
            }
        }
    },
    
    network: {
        isOnline: function(){
            if(navigator.onLine !== undefined && navigator.onLine !== null){
                return navigator.onLine;
            }
            else{
                // Handle IE and more capable browsers
                var xhr = new XMLHttpRequest();
                
                // Open new request as a HEAD to the root hostname with a random param to bust the cache
                xhr.open( "HEAD", "//" + window.location.hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false );
                
                // Issue request and handle response
                try {
                    xhr.send();
                    return ( xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304) );
                } catch (error) {
                    return false;
                }
            }
        }
    },
    
    fileManager:{
        isImage: function(fileExtension){
            fileExtension = fileExtension.toLowerCase();
            return fileExtension === "png" || fileExtension === "jpg" || fileExtension === "jpeg";
        },
        
        isOfficeFile:function(fileExtension){
            fileExtension = fileExtension.toLowerCase();
            var isWord = fileExtension === "doc" || fileExtension === "docx";
            var isExcel = fileExtension === "xls" || fileExtension === "xlsx";
            var isPowerPoint = fileExtension === "ppt" || fileExtension === "pptx" || fileExtension === "ppsx";
            return isWord || isExcel || isPowerPoint;
        },
        
        isOpenDocument:function(fileExtension){
            fileExtension = fileExtension.toLowerCase();
            return fileExtension === "odt" || fileExtension === "ods" || fileExtension === "odp";
        }
    },
    
    country:{
        hasVAT: function(isoCountryCode){
            var euCountriesIsoCodes = [
                "at","be","bg","hr","cy",
                "cz","dk","ee","fi","fr",
                "mc","de","gb","gr","hu",
                "ie","it","lv","lt","lu",
                "mt","nl","pl","pt","ro",
                "sk","si","es","se"
            ];
            
            if(euCountriesIsoCodes.indexOf(isoCountryCode) === -1){
                return false;
            }
            return true;
        }  
    },
    
    capitalizeFirstLetter: function (text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },
    
    unescapeTextFromQuotes: function(text){
        var unescapedString = text.replace(new RegExp("amp;","g"),"");
        return unescapedString.replace(new RegExp("&#039;","g"),"'");
    },
    
    getDateString: function(dateInSeconds,showHourAndMinutes){
        var date = new Date(Number(dateInSeconds) * 1000);
        
        if(showHourAndMinutes){
            return date.toLocaleString();
        }
        
        return date.toLocaleDateString();
    },
    
    deleteNodeChilds: function(node){
        while(node.firstChild){
            node.removeChild(node.firstChild);
        }
    },
    
    isDateCorrect: function(day,month,year){
        day = Number(day);
        month = Number(month);
        year = Number(year);
        
        if(!day || !month || !year){
            return false;
        }
        
        if(month === 2){
            if(utils.isLeapYear(year)){
                if(day > 28){
                    return false;
                }
                else if(day > 29){
                    return false;
                }
            }
            else{
                if(day === 31){
                    return false;
                }
            }
        }
        else if(month === 4 || month === 6 || month === 9 || month === 11){
            if(day === 31){
                return false;
            }
        }
        
        return true;
    },
    
    updateDateStrings: function(){
        $("[date]").each(function(index,node){
            if($(node).attr("date")){
                var dateInMillis = Number($(node).attr("date")) * 1000;
                var date = new Date(dateInMillis); 
                $(node).text(date.toLocaleDateString());
            }
            else{
                $(node).text("");
            }
        });
    },
    
    isLeapYear: function(year){
        if (year % 4 === 0){
            if (year % 100 === 0){
                if (year % 400 === 0){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return true;
            }
        }
        else{
            return false;
        }
    }
};