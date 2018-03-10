/**
 * @file
 * Menuu toggle behavior.
 */

(function($, window, Drupal) {

  'use strict';

  /**
   * Provides filter toggle functionality.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the behavior for toggling filters.
   */
  Drupal.behaviors.toggleFilter = {
    attach: function(context) {

      var menu = $('.btn__menu');

      menu.click(function(e) {
        e.preventDefault();

        $('body').toggleClass('r-header-navigation--expanded');
      });
    },
  };
})(jQuery, window, Drupal);

var MonoTypeWebFonts = {};
MonoTypeWebFonts.addEvent = function(e, n) {
  if ('undefined' !=
      typeof MonoTypeWebFonts.loadFonts) {
    MonoTypeWebFonts.addEvent(e, n);
  }
  else {
    var o = this;
    setTimeout(function() {o.addEvent(e, n);}, 0);
  }
};
mti_loadScript(function() {
  if (window.addEventListener) {
    window.addEventListener('load', function() {MonoTypeWebFonts.cleanup();},
        false);
  }
  else if (window.attachEvent) {
    window.attachEvent('onload', function() {MonoTypeWebFonts.cleanup();});
  }
  MonoTypeWebFonts.loadColo = function() {};
  MonoTypeWebFonts.cleanupExecuted = false;
  MonoTypeWebFonts.cleanup = function() {
    if (MonoTypeWebFonts.cleanupExecuted === true) { return; }
    MonoTypeWebFonts.cleanupExecuted = (window['mti_element_cache'].length > 0);
    var className = document.documentElement.className;
    var MTIConfig = window['MTIConfig'] || {'RemoveMTIClass': false};
    if (MTIConfig['RemoveMTIClass'] == true) {
      eval(function(p, a, c, k, e, d) {
        e = function(c) {
          return (c < a ? '' : e(parseInt(c / a))) +
              ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
        };
        if (!''.replace(/^/, String)) {
          while (c--) {d[e(c)] = k[c] || e(c);}
          k = [function(e) {return d[e];}];
          e = function() {return '\\w+';};
          c = 1;
        }
        ;
        while (c--) {
          if (k[c]) {
            p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
          }
        }
        return p;
      }('8 l(2,n){n(2);2=2.D;r(2){l(2,n);2=2.A}}8 e(4){9(j.e){o j.e(4)}x{5 k=[];l(j.I,8(2){5 a,c=2.4,i;9(c){a=c.z(\' \');p(i=0;i<a.f;i++){9(a[i]===4){k.F(2);J}}}});o k}}H(8(){5 3=e(\'m\');5 u=E.K;5 h=u.B(),C=8(t){o h.G(t)>-1},b=(!(/R|T/i.q(h))&&/S\\s(\\d)/.q(h)),c=L;9((v.$1==6)||(v.$1==7)){c=Q}r(3.f>0){p(5 i=0;i<3.f;i++){5 w=3[i].4.z(\' \');9(w.f==1&&!c){3[i].M(\'N\')}x{3[i].4=3[i].4.y(/m/O,\' \').y(/^\\s+|\\s+$/g,\'\')}}3=e(\'m\')}},P);',
          56, 56,
          '||node|mti_elements|className|var|||function|if|||||getElementsByClassName|length||ua||document|results|walkTheDOM|mti_font_element|func|return|for|test|while||||RegExp|classList|else|replace|split|nextSibling|toLowerCase|is|firstChild|navigator|push|indexOf|setTimeout|body|break|userAgent|false|removeAttribute|class|ig|40000|true|opera|msie|webtv'.split(
              '|'), 0, {}));
    }
    className = className;
    if (!document.getElementById('MonoTypeFontApiFontTracker')) {
      eval(function(p, a, c, k, e, d) {
        e = function(c) {return c.toString(36);};
        if (!''.replace(/^/, String)) {
          while (c--) {d[e(c)] = k[c] || e(c);}
          k = [function(e) {return d[e];}];
          e = function() {return '\\w+';};
          c = 1;
        }
        ;
        while (c--) {
          if (k[c]) {
            p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
          }
        }
        return p;
      }('5 3="6://j.i.z/t/1.7";a(k.l.h==\'8:\'){3=3.g(/6:/,\'8:\')}5 b=9.d(\'e\')[0];5 2=9.v(\'w\');a(2){2.4(\'y\',\'u\');2.4(\'s\',\'o/7\');2.4(\'q\',\'r\');2.4(\'f\',3+"?p=x&n=m");b.c(2)}',
          36, 36,
          '||cssEle|fontTrackingUrl|setAttribute|var|http|css|https|document|if|head|appendChild|getElementsByTagName|HEAD|href|replace|protocol|fonts|fast|window|location|fa54029e-acb9-4cae-afda-519fe2ddbc1a|projectid|text|apiType|rel|stylesheet|type||MonoTypeFontApiFontTracker|createElement|LINK|js|id|net'.split(
              '|'), 0, {}));
    }
    window['mti_element_cache'] = [];
  };
  MonoTypeWebFonts._fontActiveEventList = [];
  MonoTypeWebFonts._fontLoadingEventList = [];
  MonoTypeWebFonts._activeEventList = [];
  MonoTypeWebFonts._inActiveEventList = [];
  MonoTypeWebFonts.addEvent = function(
      eventName, callbackFunction) {
    if (eventName.toLowerCase() == 'fontactive') {
      MonoTypeWebFonts._fontActiveEventList.push(callbackFunction);
    }
    else if (eventName.toLowerCase() == 'fontloading') {
      MonoTypeWebFonts._fontLoadingEventList.push(callbackFunction);
    }
    else if (eventName.toLowerCase() == 'inactive') {
      MonoTypeWebFonts._inActiveEventList.push(callbackFunction);
    }
    else if (eventName.toLowerCase() ==
        'active') { MonoTypeWebFonts._activeEventList.push(callbackFunction); }
  };
  MonoTypeWebFonts.loadFonts = function() {
    MonoTypeWebFonts.load({
      monotype: {
        efg: false,
        reqSub: false,
        enableOtf: false,
        otfJsParentUrl: 'https://fast.fonts.net/jsapi/otjs/',
        pfL: [
          {
            'fontfamily': 'Avenir LT W01_35 Light1475496',
            contentIds: {
              EOT: 'edefe737-dc78-4aa3-ad03-3c6f908330ed',
              WOFF: '908c4810-64db-4b46-bb8e-823eb41f68c0',
              WOFF2: '0078f486-8e52-42c0-ad81-3c8d3d43f48e',
              TTF: '4577388c-510f-4366-addb-8b663bcc762a',
              SVG: 'b0268c31-e450-4159-bfea-e0d20e2b5c0c',
            },
            enableSubsetting: false,
            enableOtf: false,
          },
          {
            'fontfamily': 'Avenir LT W01_45 Book1475508',
            contentIds: {
              EOT: '710789a0-1557-48a1-8cec-03d52d663d74',
              WOFF: '65d75eb0-2601-4da5-a9a4-9ee67a470a59',
              WOFF2: '065a6b14-b2cc-446e-9428-271c570df0d9',
              TTF: 'c70e90bc-3c94-41dc-bf14-caa727c76301',
              SVG: '0979215b-3a1b-4356-9c76-e90fa4551f1d',
            },
            enableSubsetting: false,
            enableOtf: false,
          },
          {
            'fontfamily': 'Avenir LT W01_55 Roman1475520',
            contentIds: {
              EOT: '57bf7902-79ee-4b31-a327-1bbf59a3d155',
              WOFF: '4b978f72-bb48-46c3-909a-2a8cd2f8819c',
              WOFF2: 'b290e775-e0f9-4980-914b-a4c32a5e3e36',
              TTF: '9bdf0737-f98c-477a-9365-ffc41b9d1285',
              SVG: '15281d0d-e3c2-46e1-94db-cb681e00bfaa',
            },
            enableSubsetting: false,
            enableOtf: false,
          },
          {
            'fontfamily': 'Avenir LT W01_65 Medium1475532',
            contentIds: {
              EOT: 'e0542193-b2e6-4273-bc45-39d4dfd3c15b',
              WOFF: 'c9aeeabd-dd65-491d-b4be-3e0db9ae47a0',
              WOFF2: '17b90ef5-b63f-457b-a981-503bb7afe3c0',
              TTF: '25f994de-d13f-4a5d-a82b-bf925a1e054d',
              SVG: '3604edbd-784e-4ca7-b978-18836469c62d',
            },
            enableSubsetting: false,
            enableOtf: false,
          },
          {
            'fontfamily': 'Avenir LT W01_85 Heavy1475544',
            contentIds: {
              EOT: '6af9989e-235b-4c75-8c08-a83bdaef3f66',
              WOFF: '61bd362e-7162-46bd-b67e-28f366c4afbe',
              WOFF2: 'd513e15e-8f35-4129-ad05-481815e52625',
              TTF: 'ccd17c6b-e7ed-4b73-b0d2-76712a4ef46b',
              SVG: '20577853-40a7-4ada-a3fb-dd6e9392f401',
            },
            enableSubsetting: false,
            enableOtf: false,
          }],
        selectorFontMap: {},
        ck: 'd44f19a684109620e4841578a290e8183ad2ae90be8697a062cdb4a96d93d0791a4a2474a9e8c2980f558740042f7a90e758993a552f7cde012339ad22a4c1814c8cf8905547ecd825ca4a447f46f029c9fb3cc2ab3fdefea76e87eccf1107a46c9b1f06581f666ff38c29888f4c90761a5ba3',
        fcURL: 'http://fast.fonts.net/dv2/',
        env: '',
        projectId: 'fa54029e-acb9-4cae-afda-519fe2ddbc1a',
        EOD: null,
      },
      fontloading: function(fontFamily, fontDescription) {
        for (var i = 0; i <
        MonoTypeWebFonts._fontLoadingEventList.length; i++) {
          MonoTypeWebFonts._fontLoadingEventList[i].call(MonoTypeWebFonts,
              fontFamily, fontDescription);
        }
      },
      fontactive: function(fontFamily, fontDescription) {
        for (var i = 0; i < MonoTypeWebFonts._fontActiveEventList.length; i++) {
          MonoTypeWebFonts._fontActiveEventList[i].call(MonoTypeWebFonts,
              fontFamily, fontDescription);
        }
      },
      inactive: function() {
        MonoTypeWebFonts.cleanup();
        for (var i = 0; i < MonoTypeWebFonts._inActiveEventList.length; i++) {
          MonoTypeWebFonts._inActiveEventList[i].call(MonoTypeWebFonts);
        }
      },
      active: function() {
        MonoTypeWebFonts.cleanup();
        for (var i = 0; i < MonoTypeWebFonts._activeEventList.length; i++) {
          MonoTypeWebFonts._activeEventList[i].call(MonoTypeWebFonts);
        }
      },
    });
  };
  try {MonoTypeWebFonts.loadFonts(); }
  catch (e) {}
  setTimeout(function() { MonoTypeWebFonts.cleanup(); }, 40000);
});

function mti_loadScript(a) {
  'undefined' != typeof MTIConfig && 1 == MTIConfig.EnableCustomFOUTHandler &&
  (document.documentElement.style.visibility = 'hidden');
  var mti_coreJsURL = 'https://fast.fonts.net/jsapi/core/mt.js';
  var env = '';
  var UA = navigator.userAgent.toLowerCase(),
      isIE8 = -1 != UA.indexOf('msie') ? parseInt(UA.split('msie')[1]) : !1;
  isIE8 && (mti_coreJsURL = 'https://fast.fonts.net/jsapi/core/mti.js');
  'undefined' != typeof MTIConfig && 1 == MTIConfig.EnableDSForAllFonts &&
  (mti_coreJsURL = isIE8
      ? 'https://fast.fonts.net/jsapi/core/mti_cjk.js'
      : 'https://fast.fonts.net/jsapi/core/mt_cjk.js');
  if ('undefined' != typeof MTIConfig &&
      'undefined' != typeof MTIConfig.version && '' != MTIConfig.version) {
    var fileName = mti_coreJsURL.split('/').pop();
    mti_coreJsURL = 'https://fast.fonts.net/jsapi/core/' + MTIConfig.version +
        '/' + fileName;
  }
  var b = document.createElement('script');
  b.type = 'text/javascript', b.readyState
      ? b.onreadystatechange = function() {
        ('loaded' == b.readyState || 'complete' == b.readyState) &&
        (b.onreadystatechange = null, a());
      }
      : b.onload = function() {a();}, b.src = mti_coreJsURL, document.getElementsByTagName(
      'head')[0].appendChild(b);
};
