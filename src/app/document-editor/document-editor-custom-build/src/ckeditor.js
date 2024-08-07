/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import BalloonToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/balloon/balloontoolbar';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount';
import viewToPlainText from '@ckeditor/ckeditor5-clipboard/src/utils/viewtoplaintext';
import Writer from '@ckeditor/ckeditor5-engine/src/model/writer';
import ChangeBuffer from '@ckeditor/ckeditor5-typing/src/utils/changebuffer';
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave.js';

//import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';


import {
  createDropdown,
  addListToDropdown
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

export class CustomDropdown extends Plugin {

  static get pluginName() {
    return 'CustomDropdown';
  }

  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add('customDropdown', locale => {

      const dropdownView = createDropdown(locale);

      dropdownView.buttonView.set({
        label: `AI Writer`,
      });
      dropdownView.extendTemplate({
        attributes: {
          class: [
            'ck ck-button ck-button_with-text ck-dropdown__button ck-custom__dropdown'
          ]
        }
      });

      const items = new Collection();

      items.add({
        type: 'button',
        model: new Model({
          label: 'Write for me'
        })
      });
      items.add({
        type: 'button',
        model: new Model({
          label: 'AI Tools'
        })
      });


      addListToDropdown(dropdownView, items);

      dropdownView.on('execute', (eventInfo) => {
        let event = new CustomEvent("CustomDropdown");
        event.selectedText = {
          text: eventInfo.source.label.split(' ').join('_').toLowerCase()
        };
        window.dispatchEvent(event);
      });

      return dropdownView;
    });
  }
}


export class AIShortcuts extends Plugin {

  static get pluginName() {
    return 'AIShortcuts';
  }

  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add('aiShortcuts', locale => {

      const dropdownView = createDropdown(locale);

      dropdownView.buttonView.set({
        label: `AI Shortcuts`,
      });
      dropdownView.extendTemplate({
        attributes: {
          class: [
            'ck ck-button ck-button_with-text ck-dropdown__button ck-custom__dropdown'
          ]
        }
      });

      const items = new Collection();

      items.add({
        type: 'button',
        model: new Model({
          label: 'Write about this'
        })
      });
      items.add({
        type: 'button',
        model: new Model({
          label: 'Paraphrase'
        })
      });
      items.add({
        type: 'button',
        model: new Model({
          label: 'Summarize'
        })
      });

      addListToDropdown(dropdownView, items);

      dropdownView.on('execute', (eventInfo) => {
        let event = new CustomEvent("AIShortcuts");
        event.selectedText = {
          text: eventInfo.source.label.split(' ').join('_').toLowerCase()
        };
        window.dispatchEvent(event);
      });

      return dropdownView;
    });
  }
}

export class DownloadDropdown extends Plugin {

  static get pluginName() {
    return 'DownloadDropdown';
  }

  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add('downloadDropdown', locale => {

      const dropdownView = createDropdown(locale);

      dropdownView.buttonView.set({
        label: `Download`,
      });
      dropdownView.extendTemplate({
        attributes: {
          class: [
            'ck ck-button ck-button_with-text ck-dropdown__button ck-custom__dropdown'
          ]
        }
      });

      const items = new Collection();

      items.add({
        type: 'button',
        model: new Model({
          label: 'Word Document'
        })
      });
      items.add({
        type: 'button',
        model: new Model({
          label: 'PDF'
        })
      });
      items.add({
        type: 'button',
        model: new Model({
          label: 'Copy Text'
        })
      });

      addListToDropdown(dropdownView, items);

      dropdownView.on('execute', (eventInfo) => {
        let event = new CustomEvent("DownloadDropdown");
        event.selectedText = {
          text: eventInfo.source.label.split(' ').join('_').toLowerCase(),
          html: document.getElementsByClassName('ck-content')
        };
        window.dispatchEvent(event);
      });

      return dropdownView;
    });
  }
}

export class TextSelection extends Plugin {
  static get pluginName() {
    return 'TextSelection';
  }

  init() {
    const editor = this.editor;

    editor.model.document.selection.on("change:range", (data) => {
      if (data.source._ranges.length) {
        if (JSON.stringify(data.source._ranges[0].end.path) !== JSON.stringify(data.source._ranges[0].start.path)) {
          const selection = editor.model.document.selection;
          const range = selection.getFirstRange();
          let selectedText = '';
          let rangeItems = [];

          for (const item of range.getItems()) {
            if (item.data) {
              rangeItems.push(item.data)
            }

            // new logic for adding new line characters for empty paragraphs
            // TODO needs more testing
            //if (item.name == 'paragraph' && item.childCount == 0){
            //    rangeItems.push("\\n")
            //}

            //if (item.name == 'paragraph' && item.childCount >= 1 && rangeItems.length > 0){
            //    rangeItems.push("\\n")
            //}

          }

          selectedText = rangeItems.join(' ');

          let event = new CustomEvent("textSelectionDone");
          event.selectedText = {
            text: selectedText
          };
          window.dispatchEvent(event);
        }
      }
    });
  }
}

export class WritingEffect extends Plugin {
  static get pluginName() {
    return 'WitingEffect';
  }

  init() {
    const editor = this.editor;
    editor.on('ready', () => {
      // console.log('instance last ready')
      // const insertPosition = this.editor.model.document.selection.getFirstPosition();
      // const viewFragment = this.editor.data.processor.toView(`<p></p>`);
      // const modelFragment = this.editor.data.toModel(viewFragment);
      // this.editor.model.insertContent(modelFragment);
      // let effectArray = ['fssdf', 'sfgsd', '54564', 'fgv', '357', 'df', '537', 'sdf', '254', 'df', 'ewf.',]
      // this.editor.model.change( writer => {
      // 	effectArray.forEach(el => {
      // 		writer.insertText( el + ' ', editor.model.document.selection.getFirstPosition() );
      // 	})
      // } );
    })
  }
}

export class TotalWords extends Plugin {
  static get pluginName() {
    return 'TotalWords';
  }

  init() {}
}

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
  Essentials,
  UploadAdapter,
  Autoformat,
  Bold,
  Italic,
  BlockQuote,
  CKFinder,
  CloudServices,
  EasyImage,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  TextTransformation,
  BalloonToolbar,
  CustomDropdown,
  AIShortcuts,
  DownloadDropdown,
  TextSelection,
  WordCount,
  WritingEffect,
  Autosave
];


//       'redo', 'bold', 'italic', 'blockQuote', 'link', 'ckfinder', 'imageUpload', 'heading', 'imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline', 'imageStyle:alignLeft', 'imageStyle:alignRight', 'imageStyle:alignCenter', 'imageStyle:alignBlockLeft', 'imageStyle:alignBlockRight', 'imageStyle:block', 'imageStyle:side', 'imageStyle:wrapText', 'imageStyle:breakText', 'indent', 'outdent', 'numberedList', 'bulletedList', 'mediaEmbed', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', 'customDropdowm'

// Editor configuration.
ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'selectAll',
      'undo',
      'redo', 'bold', 'italic', 'blockQuote', 'link', 'heading', 'imageTextAlternative', 'indent', 'outdent', 'numberedList', 'bulletedList', 'downloadDropdown', 'customDropdown'
    ]
  },
  balloonToolbar: {
    items: [
      'bold',
      'italic',
      'heading',
      'link',
      '|',
      'aiShortcuts'
    ]
  },
  image: {
    toolbar: [
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      '|',
      'toggleImageCaption',
      'imageTextAlternative'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells'
    ]
  },
  autosave: {
    save(editor) {
      let event = new CustomEvent("autoSave");
      event.saveData = editor.getData();
      window.dispatchEvent(event);
    }
  },
  wordCount: {
    onUpdate: stats => {
      let event = new CustomEvent("totalWords");
      event.stats = {words: stats.words, characters: stats.characters}
      window.dispatchEvent(event);
    }
  },
  language: 'en'
};
