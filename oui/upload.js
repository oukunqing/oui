function uploadSlice(file, buffer, section_size, packet_num) {
	var packet_size = section_size, buffer_size = buffer.byteLength,
        pc = parseInt(buffer_size / section_size, 10) + (buffer_size % section_size !== 0 ? 1 : 0),
        pn = packet_num;

    if (packet_size > buffer_size) {
        packet_size = buffer_size;
    }
    var total_size = packet_num * section_size + packet_size;
    if (total_size > buffer_size) {
        packet_size = buffer_size - packet_num * section_size;
    }

    var start = packet_num * section_size,
        end = start + packet_size,
        section = buffer.slice(start, end);

     var urlparam = 'action=upload&pc={0}&ps={1}&pn={2}&name={3}'.format(pc, section_size, pn, file.name);

      $.ajax({
        url: '/modules/device/dtu/upload.aspx?' + urlparam,
        type: 'POST',
        async: true,
        data: section,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log('data: ', data);

            var fd = $.toJson(data) || {};
            if (1 !== fd.result) {
                $.alert(fd.msg);
                dtu.form.show_process_time(0);
                return false;
            }
            if (total_size < buffer.byteLength) {
                dtu.form.show_process(parseInt(total_size * 100 / buffer_size, 10));
                window.setTimeout(function () {
                    dtu.form.upload_slice(type, file, buffer, section_size, ++packet_num);
                }, 20);
            } else {
                if (1 === fd.result) {
                    $('#url').prop('value', fd.url || '');

                    dtu.form.get_update_file(type);

                    dtu.form.show_process(100);
                    dtu.form.show_process_time(0);

                    window.setTimeout(function () {
                        $.dialog.close('dialog_upload_file_start');
                        $.alert('文件上传成功', {
                            id: 'dialog_upload_file_finish',
                            skin: 'default', autoClose: true, timeout: 1500,
                            callback: function () {
                                dtu.form.get_update_data(true);
                            }
                        });
                    }, 50);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.dialog.close('dialog_upload_file_start');
            $.alert('<div class="alert">文件上传失败：<br /><b>' + textStatus + '<br />' + errorThrown + '</b><div>', {
                id: 'dialog_upload_file_finish', skin: 'default'
            });
            dtu.form.show_process_time(0);
        }
    });
}

function uploadFile(file) {	
	var reader = new FileReader();
	reader.onload = function() {
		var _result = this.result;
		window.setTimeout(function() {
			uploadSlice(file, _result, 512, 0);
		}, 20);

	};
	reader.readAsArrayBuffer(file);
}
