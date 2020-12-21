var dropDiv = document.getElementById('drop_div');

dropDiv.addEventListener('dragenter', function () {
  event.preventDefault();
}, false);
dropDiv.addEventListener('dragover', function () {
  event.preventDefault();
}, false);

dropDiv.addEventListener('drop', function (event) {

  event.preventDefault();
  readFile(event.dataTransfer.files[0]);
}, false);

function readFile(file) {
  console.log(file)
  var fileReader = new FileReader();
  fileReader.onload = function (event) {
    var result = event.target.result;
    var dartCode = buildDratCode(result);
    appendCode(dartCode);
    createDownloadFile('iconFont.dart', dartCode);
  };
  fileReader.readAsText(file);
}

function appendCode (code) {
  document.querySelector('#dart_code').innerHTML = '<pre>' + code + '</pre>';
}

/**
 * 创建并下载文件
 * @param  {String} fileName 文件名
 * @param  {String} content  文件内容
 */
function createDownloadFile(fileName, content) {
  console.log('123')
  var aTag = document.createElement('a');
  var blob = new Blob([content]);
  aTag.setAttribute('href', URL.createObjectURL(blob));
  aTag.setAttribute('download', fileName);
  aTag.href = URL.createObjectURL(blob);
  aTag.innerText = `下载${fileName}`
  document.querySelector('.to-dart').appendChild(aTag);
}

function buildDratCode(css) {
  var names = css.match(/(?<=\.).+(?=:before)/g);
  var values = css.match(/(?<="\\)e[0-9a-zA-Z]{3}(?=";)/g);
  var rawContent = "import 'package:flutter/widgets.dart';";
  rawContent += "\nclass IconFont{";
  rawContent += "\n\tstatic const String _family = 'iconfont';";
  rawContent += "\n\tIconFont._();";

  for (var i = 0; i < names.length; i++) {
    var name = names[i].replace(/-/g, '_');
    rawContent += "\n\tstatic const IconData " + name + " = IconData(0x" + values[i] + ", fontFamily: _family);"
  }
  rawContent += "\n}";
  console.log(rawContent);
  return rawContent;
}