export type HTMLElementName =
    'a'| 'abbr'| 'address'| 'area'| 'article'| 'aside'| 'audio'|
    'b'| 'base'| 'bdi'| 'bdo'| 'big'| 'blockquote'| 'body'| 'br'|
    'button'| 'canvas'| 'caption'| 'cite'| 'code'| 'col'| 'colgroup'|
    'data'|  'datalist'|  'dd'| 'del'|  'details'| 'dfn'|  'dialog'|
    'div'| 'dl'|  'dt'| 'em'|  'embed'|  'fieldset'| 'figcaption'|
    'figure'|  'footer'| 'form'| 'h1'| 'h2'|  'h3'| 'h4'|  'h5'| 'h6'|
    'head'| 'header'| 'hgroup'|  'hr'| 'html'| 'i'| 'iframe'| 'img'|
    'input'| 'ins'| 'kbd'| 'keygen'| 'label'| 'legend'| 'li'| 'link'|
    'main'| 'map'| 'mark'| 'menu'| 'menuitem'| 'meta'| 'meter'| 'nav'|
    'noscript'| 'object'| 'ol'| 'optgroup'| 'option'| 'output'| 'p'|
    'param'| 'picture'|  'pre'| 'progress'|  'q'| 'rp'| 'rt'| 'ruby'|
    's'| 'samp'| 'script'| 'section'| 'select'| 'small'| 'source'|
    'span'| 'strong'| 'style'| 'sub'| 'summary'| 'sup'| 'table'|
    'tbody'| 'td'| 'textarea'| 'tfoot'| 'th'| 'thead'| 'time'| 'title'|
    'tr'| 'track'| 'u'| 'ul'| 'var'| 'video'| 'wbr'| 'webview';

export const listOfHTMLElementNames: ReadonlyArray<HTMLElementName> = [
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
    'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br',
    'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
    'data',  'datalist',  'dd', 'del',  'details', 'dfn',  'dialog',
    'div', 'dl',  'dt', 'em',  'embed',  'fieldset', 'figcaption',
    'figure',  'footer', 'form', 'h1', 'h2',  'h3', 'h4',  'h5', 'h6',
    'head', 'header', 'hgroup',  'hr', 'html', 'i', 'iframe', 'img',
    'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link',
    'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav',
    'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p',
    'param', 'picture',  'pre', 'progress',  'q', 'rp', 'rt', 'ruby',
    's', 'samp', 'script', 'section', 'select', 'small', 'source',
    'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table',
    'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title',
    'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'webview'
];

export type EventAttributeName =
    'onCopy' | 'onCopyCapture' | 'onCut' | 'onCutCapture' | 'onPaste' | 'onPasteCapture' |
    'onCompositionEnd' | 'onCompositionEndCapture' | 'onCompositionStart' | 'onCompositionStartCapture' |
    'onCompositionUpdate' | 'onCompositionUpdateCapture' | 'onFocus' | 'onFocusCapture' | 'onBlur' |
    'onBlurCapture' | 'onChange' | 'onChangeCapture' | 'onInput' | 'onInputCapture' | 'onReset' |
    'onResetCapture' | 'onSubmit' | 'onSubmitCapture' | 'onInvalid' | 'onInvalidCapture' | 'onLoad' |
    'onLoadCapture' | 'onError' | 'onErrorCapture' | 'onKeyDown' | 'onKeyDownCapture' | 'onKeyPress' |
    'onKeyPressCapture' | 'onKeyUp' | 'onKeyUpCapture' | 'onAbort' | 'onAbortCapture' | 'onCanPlay' |
    'onCanPlayCapture' | 'onCanPlayThrough' | 'onCanPlayThroughCapture' | 'onDurationChange' |
    'onDurationChangeCapture' | 'onEmptied' | 'onEmptiedCapture' | 'onEncrypted' | 'onEncryptedCapture' |
    'onEnded' | 'onEndedCapture' | 'onLoadedData' | 'onLoadedDataCapture' | 'onLoadedMetadata' |
    'onLoadedMetadataCapture' | 'onLoadStart' | 'onLoadStartCapture' | 'onPause' | 'onPauseCapture' |
    'onPlay' | 'onPlayCapture' | 'onPlaying' | 'onPlayingCapture' | 'onProgress' | 'onProgressCapture' |
    'onRateChange' | 'onRateChangeCapture' | 'onSeeked' | 'onSeekedCapture' | 'onSeeking' |
    'onSeekingCapture' | 'onStalled' | 'onStalledCapture' | 'onSuspend' | 'onSuspendCapture' |
    'onTimeUpdate' | 'onTimeUpdateCapture' | 'onVolumeChange' | 'onVolumeChangeCapture' | 'onWaiting' |
    'onWaitingCapture' | 'onClick' | 'onClickCapture' | 'onContextMenu' | 'onContextMenuCapture' |
    'onDoubleClick' | 'onDoubleClickCapture' | 'onDrag' | 'onDragCapture' | 'onDragEnd' | 'onDragEndCapture' |
    'onDragEnter' | 'onDragEnterCapture' | 'onDragExit' | 'onDragExitCapture' | 'onDragLeave' |
    'onDragLeaveCapture' | 'onDragOver' | 'onDragOverCapture' | 'onDragStart' | 'onDragStartCapture' |
    'onDrop' | 'onDropCapture' | 'onMouseDown' | 'onMouseDownCapture' | 'onMouseEnter' | 'onMouseLeave' |
    'onMouseMove' | 'onMouseMoveCapture' | 'onMouseOut' | 'onMouseOutCapture' | 'onMouseOver' |
    'onMouseOverCapture' | 'onMouseUp' | 'onMouseUpCapture' | 'onSelect' | 'onSelectCapture' |
    'onTouchCancel' | 'onTouchCancelCapture' | 'onTouchEnd' | 'onTouchEndCapture' | 'onTouchMove' |
    'onTouchMoveCapture' | 'onTouchStart' | 'onTouchStartCapture' | 'onPointerDown' | 'onPointerDownCapture' |
    'onPointerMove' | 'onPointerMoveCapture' | 'onPointerUp' | 'onPointerUpCapture' | 'onPointerCancel' |
    'onPointerCancelCapture' | 'onPointerEnter' | 'onPointerEnterCapture' | 'onPointerLeave' |
    'onPointerLeaveCapture' | 'onPointerOver' | 'onPointerOverCapture' | 'onPointerOut' | 'onPointerOutCapture' |
    'onGotPointerCapture' | 'onGotPointerCaptureCapture' | 'onLostPointerCapture' | 'onLostPointerCaptureCapture' |
    'onScroll' | 'onScrollCapture' | 'onWheel' | 'onWheelCapture' | 'onAnimationStart' | 'onAnimationStartCapture' |
    'onAnimationEnd' | 'onAnimationEndCapture' | 'onAnimationIteration' | 'onAnimationIterationCapture' |
    'onTransitionEnd' | 'onTransitionEndCapture';

export const listOfEventAttributeNames: ReadonlyArray<EventAttributeName> = [
    'onCopy', 'onCopyCapture', 'onCut', 'onCutCapture', 'onPaste', 'onPasteCapture',
    'onCompositionEnd', 'onCompositionEndCapture', 'onCompositionStart', 'onCompositionStartCapture',
    'onCompositionUpdate', 'onCompositionUpdateCapture', 'onFocus', 'onFocusCapture', 'onBlur',
    'onBlurCapture', 'onChange', 'onChangeCapture', 'onInput', 'onInputCapture', 'onReset',
    'onResetCapture', 'onSubmit', 'onSubmitCapture', 'onInvalid', 'onInvalidCapture', 'onLoad',
    'onLoadCapture', 'onError', 'onErrorCapture', 'onKeyDown', 'onKeyDownCapture', 'onKeyPress',
    'onKeyPressCapture', 'onKeyUp', 'onKeyUpCapture', 'onAbort', 'onAbortCapture', 'onCanPlay',
    'onCanPlayCapture', 'onCanPlayThrough', 'onCanPlayThroughCapture', 'onDurationChange',
    'onDurationChangeCapture', 'onEmptied', 'onEmptiedCapture', 'onEncrypted', 'onEncryptedCapture',
    'onEnded', 'onEndedCapture', 'onLoadedData', 'onLoadedDataCapture', 'onLoadedMetadata',
    'onLoadedMetadataCapture', 'onLoadStart', 'onLoadStartCapture', 'onPause', 'onPauseCapture',
    'onPlay', 'onPlayCapture', 'onPlaying', 'onPlayingCapture', 'onProgress', 'onProgressCapture',
    'onRateChange', 'onRateChangeCapture', 'onSeeked', 'onSeekedCapture', 'onSeeking',
    'onSeekingCapture', 'onStalled', 'onStalledCapture', 'onSuspend', 'onSuspendCapture',
    'onTimeUpdate', 'onTimeUpdateCapture', 'onVolumeChange', 'onVolumeChangeCapture', 'onWaiting',
    'onWaitingCapture', 'onClick', 'onClickCapture', 'onContextMenu', 'onContextMenuCapture',
    'onDoubleClick', 'onDoubleClickCapture', 'onDrag', 'onDragCapture', 'onDragEnd', 'onDragEndCapture',
    'onDragEnter', 'onDragEnterCapture', 'onDragExit', 'onDragExitCapture', 'onDragLeave',
    'onDragLeaveCapture', 'onDragOver', 'onDragOverCapture', 'onDragStart', 'onDragStartCapture',
    'onDrop', 'onDropCapture', 'onMouseDown', 'onMouseDownCapture', 'onMouseEnter', 'onMouseLeave',
    'onMouseMove', 'onMouseMoveCapture', 'onMouseOut', 'onMouseOutCapture', 'onMouseOver',
    'onMouseOverCapture', 'onMouseUp', 'onMouseUpCapture', 'onSelect', 'onSelectCapture',
    'onTouchCancel', 'onTouchCancelCapture', 'onTouchEnd', 'onTouchEndCapture', 'onTouchMove',
    'onTouchMoveCapture', 'onTouchStart', 'onTouchStartCapture', 'onPointerDown', 'onPointerDownCapture',
    'onPointerMove', 'onPointerMoveCapture', 'onPointerUp', 'onPointerUpCapture', 'onPointerCancel',
    'onPointerCancelCapture', 'onPointerEnter', 'onPointerEnterCapture', 'onPointerLeave',
    'onPointerLeaveCapture', 'onPointerOver', 'onPointerOverCapture', 'onPointerOut', 'onPointerOutCapture',
    'onGotPointerCapture', 'onGotPointerCaptureCapture', 'onLostPointerCapture', 'onLostPointerCaptureCapture',
    'onScroll', 'onScrollCapture', 'onWheel', 'onWheelCapture', 'onAnimationStart', 'onAnimationStartCapture',
    'onAnimationEnd', 'onAnimationEndCapture', 'onAnimationIteration', 'onAnimationIterationCapture',
    'onTransitionEnd', 'onTransitionEndCapture'
];

export type CommonHtmlAttributeName =
    'accessKey' | 'className' | 'contentEditable' | 'contextMenu' | 'dir' | 'draggable' |
    'hidden' | 'id' | 'lang' | 'placeholder' | 'slot' | 'spellCheck' | 'style' | 'tabIndex' |
    'title' | 'inputMode' | 'is' | 'radioGroup' | 'role' | 'about' | 'datatype' | 'inlist' |
    'prefix' | 'property' | 'resource' | 'typeof' | 'vocab' | 'autoCapitalize' | 'autoCorrect' |
    'autoSave' | 'color' | 'itemProp' | 'itemScope' | 'itemType' | 'itemID' | 'itemRef' | 'results' |
    'security' | 'unselectable';

export const listOfCommonHTMLAttributeNames: ReadonlyArray<CommonHtmlAttributeName> = [
    'accessKey', 'className', 'contentEditable', 'contextMenu', 'dir', 'draggable',
    'hidden', 'id', 'lang', 'placeholder', 'slot', 'spellCheck', 'style', 'tabIndex',
    'title', 'inputMode', 'is', 'radioGroup', 'role', 'about', 'datatype', 'inlist',
    'prefix', 'property', 'resource', 'typeof', 'vocab', 'autoCapitalize', 'autoCorrect',
    'autoSave', 'color', 'itemProp', 'itemScope', 'itemType', 'itemID', 'itemRef', 'results',
    'security', 'unselectable'
];

export type AriaAttributeName =
    'aria-activedescendant' | 'aria-atomic' | 'aria-autocomplete' | 'aria-busy' |
    'aria-checked' | 'aria-colcount' | 'aria-colindex' | 'aria-colspan' | 'aria-controls' |
    'aria-current' | 'aria-describedby' | 'aria-details' | 'aria-disabled' | 'aria-dropeffect' |
    'aria-errormessage' | 'aria-expanded' | 'aria-flowto' | 'aria-grabbed' | 'aria-haspopup' |
    'aria-hidden' | 'aria-invalid' | 'aria-keyshortcuts' | 'aria-label' | 'aria-labelledby' |
    'aria-level' | 'aria-live' | 'aria-modal' | 'aria-multiline' | 'aria-multiselectable' |
    'aria-orientation' | 'aria-owns' | 'aria-placeholder' | 'aria-posinset' | 'aria-pressed' |
    'aria-readonly' | 'aria-relevant' | 'aria-required' | 'aria-roledescription' | 'aria-rowcount' |
    'aria-rowindex' | 'aria-rowspan' | 'aria-selected' | 'aria-setsize' | 'aria-sort' |
    'aria-valuemax' | 'aria-valuemin' | 'aria-valuenow' | 'aria-valuetext';

export const listOfAriaAttributeNames: ReadonlyArray<AriaAttributeName> = [
    'aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-busy',
    'aria-checked', 'aria-colcount', 'aria-colindex', 'aria-colspan', 'aria-controls',
    'aria-current', 'aria-describedby', 'aria-details', 'aria-disabled', 'aria-dropeffect',
    'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup',
    'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby',
    'aria-level', 'aria-live', 'aria-modal', 'aria-multiline', 'aria-multiselectable',
    'aria-orientation', 'aria-owns', 'aria-placeholder', 'aria-posinset', 'aria-pressed',
    'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowcount',
    'aria-rowindex', 'aria-rowspan', 'aria-selected', 'aria-setsize', 'aria-sort',
    'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'
];

export type HTMLAttributeName =
    CommonHtmlAttributeName | AriaAttributeName |
    'accept' | 'acceptCharset' | 'action' | 'allowFullScreen' | 'allowTransparency' | 'alt' |
    'as' | 'async' | 'autoComplete' | 'autoFocus' | 'autoPlay' | 'capture' | 'cellPadding' |
    'cellSpacing' | 'charSet' | 'challenge' | 'checked' | 'cite' | 'classID' | 'cols' | 'colSpan' |
    'content' | 'controls' | 'coords' | 'crossOrigin' | 'data' | 'dateTime' | 'default' | 'defer' |
    'disabled' | 'download' | 'encType' | 'form' | 'formAction' | 'formEncType' | 'formMethod' |
    'formNoValidate' | 'formTarget' | 'frameBorder' | 'headers' | 'height' | 'high' | 'href' |
    'hrefLang' | 'htmlFor' | 'httpEquiv' | 'integrity' | 'keyParams' | 'keyType' | 'kind' |
    'label' | 'list' | 'loop' | 'low' | 'manifest' | 'marginHeight' | 'marginWidth' | 'max' |
    'maxLength' | 'media' | 'mediaGroup' | 'method' | 'min' | 'minLength' | 'multiple' | 'muted' |
    'name' | 'nonce' | 'noValidate' | 'open' | 'optimum' | 'pattern' | 'placeholder' | 'playsInline' |
    'poster' | 'preload' | 'readOnly' | 'rel' | 'required' | 'reversed' | 'rows' | 'rowSpan' |
    'sandbox' | 'scope' | 'scoped' | 'scrolling' | 'seamless' | 'selected' | 'shape' | 'size' |
    'sizes' | 'span' | 'src' | 'srcDoc' | 'srcLang' | 'srcSet' | 'start' | 'step' | 'summary' |
    'target' | 'type' | 'useMap' | 'value' | 'width' | 'wmode' | 'wrap';

export const listOfHTMLAttributeNames: ReadonlyArray<HTMLAttributeName> = [
    ...listOfCommonHTMLAttributeNames, ...listOfAriaAttributeNames,
    'accept', 'acceptCharset', 'action', 'allowFullScreen', 'allowTransparency', 'alt',
    'as', 'async', 'autoComplete', 'autoFocus', 'autoPlay', 'capture', 'cellPadding',
    'cellSpacing', 'charSet', 'challenge', 'checked', 'cite', 'classID', 'cols', 'colSpan',
    'content', 'controls', 'coords', 'crossOrigin', 'data', 'dateTime', 'default', 'defer',
    'disabled', 'download', 'encType', 'form', 'formAction', 'formEncType', 'formMethod',
    'formNoValidate', 'formTarget', 'frameBorder', 'headers', 'height', 'high', 'href',
    'hrefLang', 'htmlFor', 'httpEquiv', 'integrity', 'keyParams', 'keyType', 'kind',
    'label', 'list', 'loop', 'low', 'manifest', 'marginHeight', 'marginWidth', 'max',
    'maxLength', 'media', 'mediaGroup', 'method', 'min', 'minLength', 'multiple', 'muted',
    'name', 'nonce', 'noValidate', 'open', 'optimum', 'pattern', 'placeholder', 'playsInline',
    'poster', 'preload', 'readOnly', 'rel', 'required', 'reversed', 'rows', 'rowSpan',
    'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size',
    'sizes', 'span', 'src', 'srcDoc', 'srcLang', 'srcSet', 'start', 'step', 'summary',
    'target', 'type', 'useMap', 'value', 'width', 'wmode', 'wrap'
];

export type ReactSpecificAttributeName =
    'defaultChecked' |
    'defaultValue' |
    'suppressContentEditableWarning' |
    'suppressHydrationWarning';

export const listOfReactSpecificAttributeNames: ReadonlyArray<ReactSpecificAttributeName> = [
    'defaultChecked',
    'defaultValue',
    'suppressContentEditableWarning',
    'suppressHydrationWarning',
];