var socket = io.connect(location.origin);

(function($){

	$.fn.draggable = function() {
		var offset = null;
		var start = function(e) {
			var orig = e.originalEvent;
			var pos = $(this).position();
			offset = {
				x: orig.changedTouches[0].pageX - pos.left,
				y: orig.changedTouches[0].pageY - pos.top
			};
		};
		var moveMe = function(e) {
			e.preventDefault();
			var orig = e.originalEvent;
			$(this).css({
				top: orig.changedTouches[0].pageY - offset.y,
				left: orig.changedTouches[0].pageX - offset.x
			});
			socket.emit('sendMove',{
				top: orig.changedTouches[0].pageY,
				left: orig.changedTouches[0].pageX
			});
		};
		this.bind("touchstart", start);
		this.bind("touchmove", moveMe);
	};
	
	$(function(){
		$("#gravedad").click(function(){
			socket.emit('sendGravity',{busca:$("#busca").val()});
		});

		if($("#gravedad").length){
			window.addEventListener('deviceorientation', function(event) {
				socket.emit('sendOrentation',
					{
						beta: event.beta,
						gamma: event.gamma
					}
				);
			}, false);
		}

		$("#reiniciar").click(function(){
			socket.emit('sendReturn',{});
		});

		$(".cierra").click(function(){
			socket.emit('sendCierra',{});
			history.back();
		});

		$("#up").click(function(){
			socket.emit('SendArriba',{});
		});

		$("#down").click(function(){
			socket.emit('SendAbajo',{});
		});

		$(".draggable").draggable();
	});
})(jQuery);


// var socket = io.connect('http://localhost:3000');
//   socket.on('news', function (data) {
//     console.log(data);
//     socket.emit('my other event', { my: 'data' });
// });