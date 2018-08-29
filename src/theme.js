ace.define("ace/theme/decent",["require","exports","module","ace/lib/dom"], function(acequire, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-decent";
exports.cssText = `
.ace-decent .ace_gutter {
    background: #ebebeb;
    color: #333;
    overflow: hidden;
}
.ace-decent .ace_print-margin {
    width: 1px;
    background: #e8e8e8;
}
.ace-decent {
    background-color: #FFFFFF;
    color: black;
}
.ace-decent .ace_identifier {
    color: black;
}
.ace-decent .ace_keyword {
    color: #0000FF;
}
.ace-decent .ace_numeric {
    color: black;
}
.ace-decent .ace_storage {
    color: #11B7BE;
}
.ace-decent .ace_keyword.ace_operator,
.ace-decent .ace_lparen,
.ace-decent .ace_rparen,
.ace-decent .ace_punctuation {
    color: #808080;
}
.ace-decent .ace_set.ace_statement {
    color: #0000FF;
    text-decoration: underline;
}
.ace-decent .ace_cursor {
    color: black;
}
.ace-decent .ace_invisible {
    color: rgb(191, 191, 191);
}
.ace-decent .ace_constant.ace_buildin {
    color: rgb(88, 72, 246);
}
.ace-decent .ace_constant.ace_language {
    color: #979797;
}
.ace-decent .ace_constant.ace_library {
    color: rgb(6, 150, 14);
}
.ace-decent .ace_invalid {
    background-color: rgb(153, 0, 0);
    color: white;
}
.ace-decent .ace_support.ace_function {
    color: #696969;
}
.ace-decent .ace_support.ace_constant {
    color: rgb(6, 150, 14);
}
.ace-decent .ace_class {
    color: #008080;
}
.ace-decent .ace_support.ace_other {
    color: #6D79DE;
}
.ace-decent .ace_variable.ace_parameter {
    font-style: italic;
    color: #FD971F;
}
.ace-decent .ace_comment {
    color: #008000;
}
.ace-decent .ace_constant.ace_numeric {
    color: black;
}
.ace-decent .ace_variable {
    color: rgb(49, 132, 149);
}
.ace-decent .ace_xml-pe {
    color: rgb(104, 104, 91);
}
.ace-decent .ace_support.ace_storedprocedure {
    color: #800000;
}
.ace-decent .ace_heading {
    font-weight: bold;
}
.ace-decent .ace_markup.ace_list {
    color: rgb(185, 6, 144);
}
.ace-decent .ace_marker-layer .ace_selection {
    background: rgb(181, 213, 255);
}
.ace-decent .ace_marker-layer .ace_step {
    background: rgb(252, 255, 0);
}
.ace-decent .ace_marker-layer .ace_stack {
    background: rgb(164, 229, 101);
}
.ace-decent .ace_marker-layer .ace_bracket {
    margin: -1px 0 0 -1px;
    border: 1px solid rgb(192, 192, 192);
}
.ace-decent .ace_marker-layer .ace_active-line {
    background: rgba(0, 0, 0, 0.07);
}
.ace-decent .ace_gutter-active-line {
    background-color: #dcdcdc;
}
.ace-decent .ace_marker-layer .ace_selected-word {
    background: rgb(250, 250, 255);
    border: 1px solid rgb(200, 200, 250);
}
.ace-decent .ace_meta.ace_tag {
    color: #0000FF;
}
.ace-decent .ace_string.ace_regex {
    color: #007B20;
}
.ace-decent .ace_string {
    color: #007B20;
}
.ace-decent .ace_string.ace_emphasis {
    color: #000000;
    font-style: italic;
}
.ace-decent .ace_string.ace_strong {
    color: #000000;
    font-weight: bold;
}
.ace-decent .ace_entity.ace_other.ace_attribute-name {
    color: #994409;
}
.ace-decent .ace_indent-guide {
    background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;
}
`;

var dom = acequire("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
