import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin';
import mix from '@ckeditor/ckeditor5-utils/src/mix';
import FileRepository from '../node_modules/@ckeditor/ckeditor5-upload/src/filerepository';

import Adapter from './adapter';

export default class AxiosUpload {
    /**
     * @inheritDoc
     */
    constructor( editor ) {
        /**
         * The editor instance.
         *
         * Note that most editors implements {@link module:core/editor/editorwithui~EditorWithUI} interface in addition
         * to the base {@link module:core/editor/editor~Editor} interface. However, editors with external UI
         * (i.e. Bootstrap based) or headless editor may not implement {@link module:core/editor/editorwithui~EditorWithUI}
         * interface.
         *
         * Because of above, to make plugins more universal, it is recommended to split features into:
         *  - "Editing" part which use only {@link module:core/editor/editor~Editor} interface,
         *  - "UI" part which use both {@link module:core/editor/editor~Editor} interface and
         *  {@link module:core/editor/editorwithui~EditorWithUI} interface.
         *
         * @readonly
         * @member {module:core/editor/editor~Editor} #editor
         */
        this.editor = editor;
    }

    static get requires() {
        return [FileRepository];
    }

    static get pluginName() {
        return 'AxiosUpload';
    }

    init() {
        const url = this.editor.config.get('axiosUpload.uploadUrl');

        if (!url) {
            console.warn('axiosUpload.uploadUrl is not configured');
            return;
        }

        this.editor.plugins.get('FileRepository').createUploadAdapter = loader => new Adapter(loader, url, this.editor.t);
    }

    /**
     * @inheritDoc
     */
    destroy() {
        this.stopListening();
    }
}

mix( AxiosUpload, ObservableMixin );