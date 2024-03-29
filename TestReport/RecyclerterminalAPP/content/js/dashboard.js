/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();
    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter)
        regexp = new RegExp(seriesFilter, 'i');

    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            var newRow = tBody.insertRow(-1);
            for(var col=0; col < item.data.length; col++){
                var cell = newRow.insertCell(-1);
                cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
               "color" : "red"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "blue"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round(series.percent)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.85, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Order"], "isController": true}, {"data": [1.0, 500, 1500, "获取app最新版本"], "isController": false}, {"data": [1.0, 500, 1500, "满仓页面二维码(清运完成消息通知)"], "isController": false}, {"data": [1.0, 500, 1500, "回收机首页获取客服信息"], "isController": false}, {"data": [1.0, 500, 1500, "回收机登录接口"], "isController": false}, {"data": [1.0, 500, 1500, "居民用户登录"], "isController": false}, {"data": [1.0, 500, 1500, "心跳接口-新版0428"], "isController": false}, {"data": [0.0, 500, 1500, "创建回收机订单"], "isController": false}, {"data": [1.0, 500, 1500, "回收机首页二维码(登录)"], "isController": false}, {"data": [0.0, 500, 1500, "回收机上传图片"], "isController": false}, {"data": [1.0, 500, 1500, "resident"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20, 0, 0.0, 2464.500000000002, 4122.499999999999, 4205.0, 0.8233841086867023, 0.3175335786331824, 57, 4205], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "90th pct", "95th pct", "99th pct", "Throughput", "KB/sec", "Min", "Max"], "items": [{"data": ["Order", 1, 0, 0.0, 4205.0, 4205.0, 4205.0, 0.23781212841854935, 0.1841650564803805, 4205, 4205], "isController": true}, {"data": ["获取app最新版本", 1, 0, 0.0, 97.0, 97.0, 97.0, 10.309278350515465, 2.4061694587628866, 97, 97], "isController": false}, {"data": ["满仓页面二维码(清运完成消息通知)", 1, 0, 0.0, 206.0, 206.0, 206.0, 4.854368932038835, 2.6452518203883497, 206, 206], "isController": false}, {"data": ["回收机首页获取客服信息", 1, 0, 0.0, 57.0, 57.0, 57.0, 17.543859649122805, 4.24890350877193, 57, 57], "isController": false}, {"data": ["回收机登录接口", 1, 0, 0.0, 294.0, 294.0, 294.0, 3.401360544217687, 3.2784598214285716, 294, 294], "isController": false}, {"data": ["居民用户登录", 1, 0, 0.0, 235.0, 235.0, 235.0, 4.25531914893617, 3.0169547872340425, 235, 235], "isController": false}, {"data": ["心跳接口-新版0428", 10, 0, 0.0, 241.8, 242.0, 242.0, 0.651508241579256, 0.14442614339696397, 121, 242], "isController": false}, {"data": ["创建回收机订单", 1, 0, 0.0, 2555.0, 2555.0, 2555.0, 0.39138943248532293, 0.21633439334637963, 2555, 2555], "isController": false}, {"data": ["回收机首页二维码(登录)", 1, 0, 0.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.7521603697749195, 311, 311], "isController": false}, {"data": ["回收机上传图片", 1, 0, 0.0, 1650.0, 1650.0, 1650.0, 0.6060606060606061, 0.13435132575757577, 1650, 1650], "isController": false}, {"data": ["resident", 1, 0, 0.0, 235.0, 235.0, 235.0, 4.25531914893617, 3.0169547872340425, 235, 235], "isController": true}]}, function(index, item){
        switch(index){
            case 3:
                item = item.toFixed(2) + '%';
                break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
});
