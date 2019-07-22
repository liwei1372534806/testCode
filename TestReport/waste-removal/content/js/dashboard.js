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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.85, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "2-4JDBC Request"], "isController": false}, {"data": [0.0, 500, 1500, "1-2JDBC Request"], "isController": false}, {"data": [0.0, 500, 1500, "1-4JDBC Request"], "isController": false}, {"data": [0.95, 500, 1500, "1-3心跳接口-满仓10次(产生清运单)"], "isController": false}, {"data": [0.5, 500, 1500, "1-6完成清运"], "isController": false}, {"data": [1.0, 500, 1500, "1-1回收机登录接口"], "isController": false}, {"data": [1.0, 500, 1500, "1-5开始清运"], "isController": false}, {"data": [1.0, 500, 1500, "2-2JDBC Request"], "isController": false}, {"data": [1.0, 500, 1500, "2-3回收卡执行清运（创建清运中的单子）"], "isController": false}, {"data": [1.0, 500, 1500, "2-1回收机登录接口"], "isController": false}, {"data": [1.0, 500, 1500, "2-5完成清运"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20, 0, 0.0, 1712.3000000000018, 2628.1499999999996, 2672.0, 0.6149683291310498, 0.18488085949511102, 26, 2672], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "90th pct", "95th pct", "99th pct", "Throughput", "KB/sec", "Min", "Max"], "items": [{"data": ["2-4JDBC Request", 1, 0, 0.0, 26.0, 26.0, 26.0, 38.46153846153847, 1.8780048076923077, 26, 26], "isController": false}, {"data": ["1-2JDBC Request", 1, 0, 0.0, 2672.0, 2672.0, 2672.0, 0.37425149700598803, 0.012060839258982036, 2672, 2672], "isController": false}, {"data": ["1-4JDBC Request", 1, 0, 0.0, 1795.0, 1795.0, 1795.0, 0.5571030640668524, 0.013057103064066853, 1795, 1795], "isController": false}, {"data": ["1-3心跳接口-满仓10次(产生清运单)", 10, 0, 0.0, 886.3000000000003, 968.0, 968.0, 0.4990518015770037, 0.11062964741990218, 102, 968], "isController": false}, {"data": ["1-6完成清运", 1, 0, 0.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.5547913205980066, 602, 602], "isController": false}, {"data": ["1-1回收机登录接口", 1, 0, 0.0, 316.0, 316.0, 316.0, 3.1645569620253164, 3.0502126186708862, 316, 316], "isController": false}, {"data": ["1-5开始清运", 1, 0, 0.0, 120.0, 120.0, 120.0, 8.333333333333334, 2.783203125, 120, 120], "isController": false}, {"data": ["2-2JDBC Request", 1, 0, 0.0, 36.0, 36.0, 36.0, 27.777777777777775, 0.8951822916666667, 36, 36], "isController": false}, {"data": ["2-3回收卡执行清运（创建清运中的单子）", 1, 0, 0.0, 166.0, 166.0, 166.0, 6.024096385542169, 4.39453125, 166, 166], "isController": false}, {"data": ["2-1回收机登录接口", 1, 0, 0.0, 186.0, 186.0, 186.0, 5.376344086021506, 5.182081653225806, 186, 186], "isController": false}, {"data": ["2-5完成清运", 1, 0, 0.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.890625, 375, 375], "isController": false}]}, function(index, item){
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
