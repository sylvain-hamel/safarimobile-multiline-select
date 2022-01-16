/*
===============================================================
Copyright (C) 2012 Sylvain Hamel

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished 
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
===============================================================
*/
/*global $:false, window:false, navigator:false */
(function () {
    "use strict";

    // set isSafari to true to bypass user agent check when 
    // testing in a browser other than safari mobile 
    function SelectConverter(forceSafariMobileMode) {
        
        var that = this;

        var styles =
        '<style type="text/css">' +
        '    /* styles for the safarimobile-multiline-select plug-in */ \r\n'  +
        '    .multilineselect {border: 1px solid silver; display:inline-block; margin:0px; padding:2px; height: 100px; overflow:auto; width:300px; vertical-align: text-bottom;} \r\n' +
        '    .multilineselect li {list-style-type: none; list-style-position:inside; margin:0px; padding:0px; cursor:default;}  \r\n' + 
        '    .multilineselect li.selected {color: white; background-color: darkgrey;}  \r\n' +
        '</style>';


        that.isSafariMobile = function () {
            return (navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)) || forceSafariMobileMode;
        };

        that.selectIsMultiline = function (item) {
            var value = item.attr('size');
            return  !( value === undefined || value === "1");
        };

        that.selectValue = function(ul, selected){
            ul.children('li').removeClass('selected');
            
            for (var i=0; i < selected.length ;i++){
                var val = selected[i].value;
                var toSelect = ul.find('li[data-value="' + val + '"]');
            	toSelect.addClass('selected');
            }
            
        };

        that.createListFromSelectElement = function (select) {
            var ul = $('<ul class="multilineselect">');

            var selectid = select.attr("id");
            if ( selectid !== undefined ){
                ul.attr("id", selectid + "_safarimobile");
            }

            var selectedValues = function(e,value,clicked){
              var values = [];
              var selected_li = clicked.parent().children('.selected');                  
              if (e.ctrlKey && selected_li.length > 0){
                var isfound = false;
                for (var i=0 ; i < selected_li.length  ; i++){
                  if (value != selected_li[i].dataset.value ){
                    values.push(selected_li[i].dataset.value);
                  }else {
                    isfound = true;
                  }
                }
                if (isfound == false){
                  values.push(value);
                }
              
              } else if (e.shiftKey && selected_li.length > 0){
                var last_li = selected_li[selected_li.length - 1];                    
                var p1= $(last_li).index();
                var p2 = clicked.index();
                var li_list = clicked.parent().children();

                for (var i = Math.min(p1, p2); i <= Math.max(p1, p2); ++i) {
                  values.push(li_list[i].dataset.value);
                }
                    
               } else {
                 values.push(value);
               }
               
               return values;
            };
            
            var rebuild = function () {
              select.children('option').each(function() {
                var option = $(this);

                var li = $('<li>');
                li.attr('data-value', option.val());
                li.html(option.html());

                // when items is clicked, push value to the original <select>
                li.click(function(e) {
                  
                  var value = $(this).attr('data-value');
                  var values = selectedValues(e,value,$(this));

                  select.val(values);
                  select.change();
                });

                ul.append(li);
              });
            };

            rebuild();

            // when the <select> value change, select the corresponding item in the list
            select.change(function () {
                var selected = $(this).children('option:selected');
                that.selectValue(ul, selected);
            });

            $(select).on('item-added', function () {
              ul.empty();
              rebuild();

              var selected = $(this).children('option:selected');
              that.selectValue(ul, selected);
            });

            return ul;
        };

        that.fixForSafariMobile = function (selectElements) {
            if (!that.isSafariMobile())
            {
                return;
            }

            $("head").prepend(styles);

            selectElements.each(function () {
                var select = $(this);

                if ( !that.selectIsMultiline(select))
                {
                    return;
                }

                // hide the select element but keep it in the DOM to allow existing code to
                // keep on binding to it 
                select.hide();
                var newlist = that.createListFromSelectElement(select);

                select.after(newlist);
                
            });
        };
    }

    // export SelectConverter (to instantiate in unit tests)
    window.SelectConverter = SelectConverter;

    // expose SelectConverter as a jQuery plugin
    $.fn.fixForSafariMobile = function (forceSafariMobileMode) {
        var instance = new SelectConverter(forceSafariMobileMode);
        instance.fixForSafariMobile(this);
        return this;
    };
}());
