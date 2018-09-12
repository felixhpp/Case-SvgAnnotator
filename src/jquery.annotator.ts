import {SvgAnnotatorOptions} from './SvgAnnotator/SvgAnnotatorOptions';
import {SvgAnnotator} from './SvgAnnotator/SvgAnnotator';

 ;(function($: any) {
  $.extend({
    SvgAnnotator: function(htmlElement: HTMLElement, data: string, options ?: SvgAnnotatorOptions){
      return new SvgAnnotator(htmlElement, data, options); 
    }
  });
  
})(jQuery);
/*
interface JQuery{
  SvgAnnotator(options ?: SvgAnnotatorOptions) : any;
}
*/