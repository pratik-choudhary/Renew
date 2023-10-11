// var tableToExcel = (function () {
//     var uri = 'data:application/vnd.ms-excel;base64,'
//         , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
//         , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
//         , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
//     return function (table, name) {
//         if (!table.nodeType) table = document.getElementById(table)
//         var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
//         var blob = new Blob([format(template, ctx)]);
//         var blobURL = window.URL.createObjectURL(blob);

//         if (ifIE()) {
//             csvData = table.innerHTML;
//             if (window.navigator.msSaveBlob) {
//                 var blob = new Blob([format(template, ctx)], {
//                     type: "text/html"
//                 });
//                 navigator.msSaveBlob(blob, '' + name + '.xls');
//             }
//         }
//         else
//         window.location.href = uri + base64(format(template, ctx))
//     }
// })()

// function ifIE() {
//     var isIE11 = navigator.userAgent.indexOf(".NET CLR") > -1;
//     var isIE11orLess = isIE11 || navigator.appVersion.indexOf("MSIE") != -1;
//     return isIE11orLess;
// }

var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (tables, name, fileName) {
        var inner_html = '';
        var ts = tables.split(',');
        for(var t in ts){
           if (!ts[t].nodeType) {
              var table = document.getElementById(ts[t]); 
              inner_html = inner_html + table.innerHTML + '<tr></tr>';
           }
             
        }
        var ctx = { worksheet: name || 'Worksheet', table: inner_html }
        var blob = new Blob([format(template, ctx)], { type: "application/vnd.ms-excel" });
        // var blobURL = window.URL.createObjectURL(blob);

        if (ifIE()) {
            csvData = inner_html;
            if (window.navigator.msSaveBlob) {
                var blob = new Blob([format(template, ctx)], {
                    type: "text/html"
                });
                var excelFileName = fileName + name + '.xls';
                navigator.msSaveBlob(blob, excelFileName);
            }
        }
        else {
            var excelFileName = fileName + name + '.xls';
            //var blob = new Blob([tab_text], { type: "application/vnd.ms-excel" })
            window.saveAs(blob, excelFileName);
            
            //window.location.href = uri + base64(format(template, ctx))
        }
    }
})()

var tableToExcelForSummary = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (tables, name, fileName) {
        var inner_html = '';
        var ts = tables.split(',');
        for(var t in ts){
           if (!ts[t].nodeType) {
              var table = document.getElementById(ts[t]);
              inner_html = inner_html + table.innerHTML;
           }
             
        }
        var ctx = { worksheet: name || 'Worksheet', table: inner_html }
        var blob = new Blob([format(template, ctx)], { type: "application/vnd.ms-excel" });
        // var blobURL = window.URL.createObjectURL(blob);

        if (ifIE()) {
            csvData = inner_html;
            if (window.navigator.msSaveBlob) {
                var blob = new Blob([format(template, ctx)], {
                    type: "text/html"
                });
                var excelFileName = fileName + name + '.xls';
                navigator.msSaveBlob(blob, excelFileName);
            }
        }
        else{
            var excelFileName = fileName + name + '.xls';
            //var blob = new Blob([tab_text], { type: "application/vnd.ms-excel" })
            window.saveAs(blob, excelFileName);

            //window.location.href = uri + base64(format(template, ctx))
        }
    }
})()

function ifIE() {
    var isIE11 = navigator.userAgent.indexOf(".NET CLR") > -1;
    var isIE11orLess = isIE11 || navigator.appVersion.indexOf("MSIE") != -1;
    return isIE11orLess;
}

// function fnExcelReport(id, name) {
//     var tab_text = '\uFEFF';
//     tab_text = tab_text + '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
//     tab_text = tab_text + '<head>';
//     tab_text = tab_text + '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
//     tab_text = tab_text + '<meta name="ProgId" content="Excel.Sheet" />';
//     tab_text = tab_text + '<meta name="Generator" content="Microsoft Excel 11" />';
//     tab_text = tab_text + '<title>Sample</title>';
//     tab_text = tab_text +'<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
//     tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';
//     tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
//     tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook>';
//     tab_text = tab_text + '</xml><![endif]--></head><body>';
//     tab_text = tab_text + '<table border="1px">';
//     var canv = document.getElementsByTagName('canvas');
//     var base64img = canv[0].toDataURL("image/png");
//     var blobimg = b64toBlob(base64img.split('data:image/png;base64,')[1], 'image/png');
//     var blobUrl = URL.createObjectURL(blobimg);
//     const img = document.createElement('img');
//     img.src = blobUrl;
//     var exportTable = document.getElementById(id);
//     exportTable.appendChild(img);
//     exportTable = document.getElementById(id);
//     tab_text = tab_text + exportTable.innerHTML;
//     tab_text = tab_text + '</table></body></html>';
//     var fileName = name + '.xls';
//     var blob = new Blob([tab_text], { type: "application/vnd.ms-excel" })
//     window.saveAs(blob, fileName);
// }
// function b64toBlob(b64Data, contentType, sliceSize) {
//     contentType = contentType || '';
//     sliceSize = sliceSize || 512;
  
//     var byteCharacters = atob(b64Data);
//     var byteArrays = [];
  
//     for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//       var slice = byteCharacters.slice(offset, offset + sliceSize);
  
//       var byteNumbers = new Array(slice.length);
//       for (var i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }
  
//       var byteArray = new Uint8Array(byteNumbers);
  
//       byteArrays.push(byteArray);
//     }
  
//     var blob = new Blob(byteArrays, {type: contentType});
//     return blob;
//   }

// var tableToExcelWithChart = (function () {
//     var uri = 'data:application/vnd.ms-excel;base64,'
//         , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
//         , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
//         , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
//     return function (tables, name) {
//         var inner_html = '';
//         var ts = tables.split(',');
//         for(var t in ts){
//            if (!ts[t].nodeType) {
//               var table = document.getElementById(ts[t]);
//               inner_html = inner_html + table.innerHTML;
//            }
             
//         }
//         var chart_data = '';
//         if(document.getElementsByTagName('canvas')[0]){
//            chart_data = chart_data + document.getElementsByTagName('canvas')[0].toDataURL()
//         }
//         var ctx = { worksheet: name || 'Worksheet', table: inner_html }
//         var blob = new Blob([format(template, ctx)]);
//         var blobURL = window.URL.createObjectURL(blob);

//         if (ifIE()) {
//             csvData = inner_html;
//             if (window.navigator.msSaveBlob) {
//                 var blob = new Blob([format(template, ctx)], {
//                     type: "text/html"
//                 });
//                 navigator.msSaveBlob(blob, '' + name + '.xls');
//             }
//         }
//         else
//         window.location.href = uri + base64(format(template, ctx)) + chart_data;
//     }
// })()

// var tableToExcelTest = (function () {
//     var uri = 'data:application/vnd.ms-excel;base64,'
//         , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
//         , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
//         , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
//     return function (tables, name) {

//         // str="D:\workspace\loss_calculation_fe\src\assets\data\Email_Far.xlsx";

//         // var mytable = document.getElementsById("tables")[0];

//         // var row_Count = mytable.rows.length;
//         // var col_Count =6; 

//         var ExcelApp = new ActiveXObject("Excel.Application");
//         ExcelApp.Visible=true;
//         var ExcelSheet=ExcelApp.Workbooks.Open("D:\workspace\loss_calculation_fe\src\assets\data\Email_Far.xlsx"); 



//         // for(var i=0; i < row_Count ; i++) 
//         // { 
//         // for(var j=0; j < col_Count; j++) 
//         // { 
//         str= mytable.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].innerHTML;
//         ExcelSheet.ActiveSheet.Cells(1,1).Value = 'str';
//         // }
//         // }
//         ExcelSheet.Save("D:\workspace\loss_calculation_fe\src\assets\data\Email_Far.xlsx");


//         var inner_html = '';
//         var ts = tables.split(',');
//         for(var t in ts){
//            if (!ts[t].nodeType) {
//               var table = document.getElementById(ts[t]);
//               inner_html = inner_html + table.innerHTML + '<tr></tr>';
//            }
             
//         }
//         var ctx = { worksheet: name || 'Worksheet', table: inner_html, name: 'aaa' }
//         var blob = new Blob([format(template, ctx)]);
//         var blobURL = window.URL.createObjectURL(blob);

//         if (ifIE()) {
//             csvData = inner_html;
//             if (window.navigator.msSaveBlob) {
//                 var blob = new Blob([format(template, ctx)], {
//                     type: "text/html"
//                 });
//                 navigator.msSaveBlob(blob, '' + name + '.xls');
//             }
//         }
//         else
//         window.location.href = uri + base64(format(template, ctx))
//     }
// })()
