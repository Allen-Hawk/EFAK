var url = window.location.href;
var topicName;

try {
    topicName = url.split("meta/")[1].trim();
} catch (e) {
    console.log(e);
}

var topicTable = $("#efak_topic_meta_tbl").DataTable({
    "searching":false,
    "bSort": false,
    "bLengthChange": false,
    "bProcessing": true,
    "bServerSide": true,
    "fnServerData": retrieveData,
    "sAjaxSource": "/topic/meta/table/ajax?topic=" + topicName,
    "aoColumns": [{
        "mData": 'partitionId'
    }, {
        "mData": 'logsize'
    }, {
        "mData": 'leader'
    }, {
        "mData": 'replicas'
    }, {
        "mData": 'isr'
    }, {
        "mData": 'preferredLeader'
    }, {
        "mData": 'underReplicated'
    }, {
        "mData": 'preview'
    }],
    language: {
        "sProcessing": "处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "表中数据为空",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        },
        "oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        }
    }
});

function retrieveData(sSource, aoData, fnCallback) {
    $.ajax({
        "type": "get",
        "contentType": "application/json",
        "url": sSource,
        "dataType": "json",
        "data": {
            aoData: JSON.stringify(aoData)
        },
        "success": function (data) {
            fnCallback(data)
        }
    });
}

setInterval(function () {
    topicTable.ajax.reload();
}, 60000); // 1 min

try {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/topic/record/size/ajax?topic=' + topicName,
        success: function (datas) {
            $("#efka_topic_meta_logsize").text(datas.logsize);
            $("#efka_topic_meta_capacity").text(datas.capacity);
            $("#efka_topic_meta_capacity_unit").text(datas.unit);
        }
    });
} catch (e) {
    console.log(e);
}

$(document).on('click', 'a[name=efak_topic_partition_preview]', function (event) {
    event.preventDefault();
    var topic = $(this).attr("topic");
    var partition = $(this).attr("partition");

    $('#efak_topic_partition_msg_preview_modal').modal('show');

    try {
        $.ajax({
            url: '/topic/name/msg/preview',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({
                "topicName": topic,
                "partitionId": partition
            }),
            success: function (response) {
                console.log(response);
                $("#efak_topic_name_msg_preview").text(JSON.stringify(response, null, 2));
            }
        });
    } catch (e) {
        console.log(e);
    }

});