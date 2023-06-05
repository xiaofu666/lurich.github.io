// 二维码制作
(function() {
	var canvasObj = new createQRImage('canvas', {
		width: 360
	});
	var dataURLtoBlob = function(dataURL) {
		var arr = dataURL.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {
			type: mime
		});
	};
	var u = navigator.userAgent;
	var isMobile = u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
	var isWechart = u.indexOf('MicroMessenger') > -1;
	var $document = $(document);
	var $module = $('.mod-qrcode');
	var $mask = $module.find('.mask');

	$('#resetRound').on('click', function() {
		$('input[name="round"]').val(0);
		canvasObj.changeRound(true, 0);
	});
	$('#resetRound1').on('click', function() {
		$('input[name="round"]').val(-0.5);
		canvasObj.changeRound(true, 0.5);
	});
	$('#resetRound2').on('click', function() {
		$('input[name="round"]').val(0.5);
		canvasObj.changeRound(false, 0.5);
	});
	$('input[name="round"]').on('change', function() {
		var value = $(this).val();
		var round = Math.abs(value);
		canvasObj.changeRound(value < 0, round);
	});
	$('textarea[name="content"]').on('input', function() {
		var text = $(this).val();
		canvasObj.changeText(text);
	});
	$('input[name="bgColor"]').on('change', function() {
		var color = $(this).val();
		canvasObj.changeBgColor(color);
	});
	$('input[name="fgColor"]').on('change', function() {
		var color = $(this).val();
		canvasObj.changeFgColor(color);
	});
	$('input[name="ptColor"]').on('change', function() {
		var $this = $(this);
		var color = $this.val();
		if (color) {
			$this.next().show();
			canvasObj.changePtColor(color);
		} else {
			$this.next().hide();
			canvasObj.resetPtColor();
		}
	});
	$('input[name="inptColor"]').on('change', function() {
		var $this = $(this);
		var color = $this.val();
		if (color) {
			$this.next().show();
			canvasObj.changeInPtColor(color);
		} else {
			$this.next().hide();
			canvasObj.resetInPtColor();
		}
	});
	$('input[name="gcColor"]').on('change', function() {
		var type = $('select[name="gradientWay"]').val();
		var $this = $(this);
		var color = $this.val();
		if (color) {
			$this.next().show();
			canvasObj.changeGradientWay(type, color);
		} else {
			$this.next().hide();
			canvasObj.resetGcColor();
		}
	});
	$('select[name="gradientWay"]').on('change', function() {
		var type = $(this).val();
		var color = $('input[name="gcColor"]').val();
		if (color) {
			canvasObj.changeGradientWay(type, color);
		}
	});
	$('#savepng').on('click', function() {
		var $this = $(this);
		if (isWechart) {
			$mask.show();
			return false;
		} else {
			canvasObj.getBase64(function(data) {
				var url = 'data:image/png;base64,' + data;
				if (window.navigator.msSaveBlob) {
					window.navigator.msSaveBlob(dataURLtoBlob(url), '小富二维码.png');
				} else if (navigator.userAgent.match(/MSIE 9/)) {
					$('#pngdata').val(data);
					$('#form').submit();
				} else {
					if (URL) {
						if (url.length > 1.5e6 || navigator.userAgent.indexOf('iPhone') > -
							1) { //解决dataURL过大无法下载
							url = URL.createObjectURL(dataURLtoBlob(url));
						}
					}
					// $this.attr('href', url).data('url', url).attr('download', '小富二维码.png');
					$this.savePicture(url)
				}
			});
		}
	});
	$mask.on('click', function() {
		$mask.hide();
	});
	$('select[name="logotype"]').change(function(event) {
		var type = $(this).val();
		canvasObj.changeLogotype(type);
	});
	$('input[name="logo"]').change(function(event) {
		var type = $('select[name="logotype"]').val();
		canvasObj.changeLogoimg(event, type);
	});
	$('input[type="color"]').colorpicker({
		hoverChange: true,
		size: 'small'
	});
	$document.on('click', '.J_clear', function() {
		var $this = $(this);
		var $input = $this.prev();
		$input.val('');
		switch ($input.attr('name')) {
			case 'ptColor':
				canvasObj.resetPtColor();
				break;
			case 'inptColor':
				canvasObj.resetInPtColor();
				break;
			case 'gcColor':
				canvasObj.resetGcColor();
				break;
		}
		$this.hide();
		return false;
	});
	// 保存图片到相册中 
	function savePicture(url) {
		// 创建下载任务 
		picurl = url;
		//图片保存到手机后的路径 
		picname = "erweima.png";
		var dtask = plus.downloader.createDownload(picurl, {}, function(d, status) {
			// 下载完成 
			if (status == 200) {
				//   alert( "Download success: " + d.filename ); 
				plus.gallery.save(picname, function() { //保存到相册方法 
					mui.toast('已保存到手机相册');
				}, function() {
					mui.toast('保存失败，请重试！');
				});
			} else {
				//   alert( "Download failed: " + status );  
			}
		});
		//dtask.addEventListener( "statechanged", onStateChanged, false ); 
		dtask.start(); //开始下载 
	}
})();