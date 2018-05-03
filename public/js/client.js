$(function() {
    var socket= io.connect();


    $nickname = $('#nickname');
    $nickForm = $('#setNick');
    $comment = $('#comment-container');
    $input = $('#comment-input');
    $stream = $('#comment-stream');
    $commentForm = $('#comment-form');



    $nickForm.submit(function(e){
        e.preventDefault();
        console.log("nickname="+$nickname.val());
        $('#nickWrap').hide();
        $('#comment-container').show();
        socket.emit('new user',{nickname:$nickname.val()} , function(data){

        });
    });
    $commentForm.submit(function(e){
        e.preventDefault();
        socket.emit('send message', {nickname:$nickname.val(), message:$input.val()});
        $input.val('');
    });



    socket.on('new message', function(data){
        console.log("DATA="+JSON.stringify(data));
        $stream.prepend('<li><div class="post-preview"><a href="#"><h3 class="post-subtitle">'+data.message+'</h3></a><p class="post-meta">Posted by <a href="#">'+data.nickname+'</a> on '+data.created+'</p></div></li>');
    });

});
