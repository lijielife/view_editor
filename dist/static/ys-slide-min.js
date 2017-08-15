!function($,factory){if("function"==typeof define)define.amd?define(["jQuery"],function(jQuery){return factory(jQuery||$)}):define(function(require,exports,module){var jq=require("jQuery")||$;module.exports=factory(jq)});else{if("object"!=typeof module||!module.exports)return factory($),$;module.exports=factory($)}}(jQuery,function($){"use strict";function PageSlide(me,options){this.me=me,this.options=$.extend({},defaults,options),this.init(),this.renderHtml(),this.bindEvent(),this.animateScrollTo(curIndex)}var scrollAble=!0,hasScrolled=!1,wheelAble=!0,timeoutId=void 0,curIndex=0,nextIndex=void 0,wheelValues=[],scrollTime=(new Date).getTime(),animationEnd=void 0,defaults={sectionPanel:".panel",scrollSpeed:600,scrollHeight:$(window).height(),nav:!1,keyAble:!1,delay:0,beforeScroll:function(curIndex,nextIndex){},afterScroll:function(curIndex){},renderType:"outer",insertSection:"",scrollbar:!1,animateClass:void 0};$.easing.easeOutExpo=function(x,t,b,c,d){return t==d?b+c:c*(1-Math.pow(2,-10*t/d))+b};var checkAnimation=function(){var el=document.createElement("div"),anis={animation:"animationend",WebkitAnimation:"webkitAnimationEnd",MozAnimation:"mozAnimationEnd"},animateEnd=void 0;for(var i in anis)if(void 0!==el.style[i]){animateEnd=anis[i];break}return animateEnd||!1},getPanels=function(container,clazz,insertSection,ifInsert){var tmp=[],panels=[];return container.find(clazz).each(function(i,ele){panels.push(ele)}),ifInsert&&insertSection&&(tmp=insertSection.split(","),tmp[0]&&$(tmp[0]).length>0&&panels.splice(0,0,$(tmp[0])[0]),tmp[1]&&$(tmp[1]).length>0&&panels.push($(tmp[1])[0])),panels},setPanelConfig=function(panels){var $panel,tmp=[],i=0,top=0;for(i;i<panels.length;i++)$panel=$(panels[i]),i>0&&(top+=-$(panels[i-1]).height()),tmp.push({height:$panel.height(),top:top});return tmp};PageSlide.prototype.init=function(){var that=this,me=that.me,ops=that.options,panels=this.panels=getPanels(me,ops.sectionPanel,ops.insertSection,"outer"==ops.renderType);this.configs=setPanelConfig(panels),curIndex=0,nextIndex=ops.curIndex||0,!(animationEnd=checkAnimation())&&ops.animateClass&&(that.options.animateClass=void 0)},PageSlide.prototype.renderHtml=function(){var that=this,me=that.me,ops=that.options,panels=that.panels,configs=that.configs,i=0;for(i;i<panels.length;i++)$(panels[i]).height(configs[i].height),configs[i].scrollTop=$(panels[i]).offset().top;({outer:function(){console.log("outer render")},inner:function(){$("html,body").css({height:"100%",overflow:"hidden"}),me.css({position:"absolute",width:"100%",height:"100%"}),ops.animateClass&&me.find(ops.sectionPanel).addClass(ops.animateClass.clazz)}})[ops.renderType]()};var ifScrolled=function(wheelValues){function average(num){for(var sum=0,lastElements=wheelValues.slice(Math.max(wheelValues.length-num,1)),i=0;i<lastElements.length;i++)sum+=lastElements[i];return Math.ceil(sum/num)}return average(10)>=average(70)};PageSlide.prototype.bindEvent=function(){var that=this,ops=that.options,_scroll={handleMouseDown:function(){scrollAble=!1,hasScrolled=!1},handleMouseUp:function(){scrollAble=!0,hasScrolled&&_scroll.calculateNearst()},handleScroll:function(){timeoutId&&clearTimeout(timeoutId),timeoutId=setTimeout(function(){if(hasScrolled=!0,!1===scrollAble)return!1;scrollAble=!1,_scroll.calculateNearst()},200)},calculateNearst:function(){var diff,scrollTop=$(window).scrollTop(),configs=(that.panels,that.configs),i=1,pre=Math.abs(configs[0].scrollTop-scrollTop),index=0;for(i;i<configs.length;i++)(diff=Math.abs(configs[i].scrollTop-scrollTop))<pre&&(pre=diff,index=i);nextIndex=index,that.animateScrollTo()},wheelHandler:function(e,delta){e.preventDefault();var index=curIndex,currentTime=(new Date).getTime(),value=delta||-e.originalEvent.detail||e.originalEvent.wheelDelta;if(delta=Math.max(-1,Math.min(1,value)),wheelValues.length>149&&wheelValues.shift(),wheelValues.push(Math.abs(value)),currentTime-scrollTime>200&&(wheelValues=[]),scrollTime=currentTime,!1===wheelAble)return!1;if(delta<0){if(index>=that.panels.length-1)return;index++}else if(delta>0){if(index<=0)return;index--}else index=0;ifScrolled(wheelValues)&&(nextIndex=index,that.animateScrollTo())},init:function(){"outer"===ops.renderType&&(ops.scrollbar?($(window).off("mousedown mouseup scroll"),$(window).on("mousedown",_scroll.handleMouseDown),$(window).on("mouseup",_scroll.handleMouseUp),$(window).on("scroll",_scroll.handleScroll)):$("body").css({overflow:"hidden"})),$(document).off("DOMMouseScroll mousewheel"),$(document).on("DOMMouseScroll mousewheel",_scroll.wheelHandler)}};_scroll.init();var _ani={init:function(){var i=0;for(i;i<that.panels.length;i++)$(that.panels[i]).on(animationEnd,function(){$(this).hasClass(ops.animateClass.out)&&$(this).removeClass(ops.animateClass.out),$(this).hasClass(ops.animateClass.in)&&$(this).removeClass(ops.animateClass.in)})}};ops.animateClass&&_ani.init()},PageSlide.prototype.beforeAnimate=function(){var that=this,ops=that.options,panels=that.panels;that.configs;scrollAble=!1,wheelAble=!1,$(panels[curIndex]).addClass("ys-ani"),$(panels[nextIndex]).addClass("ys-ani"),"function"==typeof ops.beforeScroll&&ops.beforeScroll.call(that,curIndex,nextIndex)},PageSlide.prototype.afterAnimate=function(){var that=this,ops=that.options,panels=that.panels;that.configs;ops.delay?setTimeout(function(){wheelAble=!0},ops.delay):wheelAble=!0,curIndex!=nextIndex&&($(panels[curIndex]).removeClass("ys-ani"),curIndex=nextIndex),"function"==typeof ops.afterScroll&&ops.afterScroll.call(that,curIndex)},PageSlide.prototype.animateScrollTo=function(){var that=this,me=that.me,ops=that.options,panels=that.panels,configs=that.configs,_move={outer:function(){$("html,body").animate({scrollTop:configs[nextIndex].scrollTop},ops.scrollSpeed,"easeOutExpo"),$("html,body").promise().done(function(){that.afterAnimate()})},inner:function(){ops.animateClass?curIndex!=nextIndex?($(panels[curIndex]).addClass(ops.animateClass.out),$(panels[nextIndex]).addClass(ops.animateClass.in),setTimeout(function(){that.afterAnimate()},ops.scrollSpeed-10)):that.afterAnimate():(me.animate({top:configs[nextIndex].top},ops.scrollSpeed,"easeOutExpo"),me.promise().done(function(){that.afterAnimate()}))}};configs[nextIndex]&&(that.beforeAnimate(),_move[ops.renderType]())},PageSlide.prototype.move=function(index){var that=this,panels=that.panels,length=panels.length;if(0==wheelAble)return!1;index>-1&&index<length&&(nextIndex=index,that.animateScrollTo())};var public_method=["move"];$.fn.ysSlide=function(options,param){return this.each(function(){var slide=$(this).data("slide");slide||$.data(this,"slide",new PageSlide($(this),options)),"string"==typeof options&&public_method.join(",").indexOf(options)>-1&&"function"==typeof slide[options]&&slide[options].call(slide,param)})}});