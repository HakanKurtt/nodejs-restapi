$(function() {
    var socket= io.connect();

    var nickname;
    $nickname = $('#nickname');
    $nickForm = $('#setNick');
    $comment = $('#comment-container');
    $input = $('#comment-input');
    $stream = $('#Mesajlasma');
    $commentForm = $('#comment-form');
    $search =$('#Search');

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
        console.log(nickname);
        socket.emit('send message', {nickname:nickname, message:$input.val()});
        $input.val('');
    });
    socket.on('new user',function (nick) {
        console.log(nick+"sersdas");
        nickname=nick;
    });


    socket.on('new message', function(data){
        console.log("DATA="+JSON.stringify(data));
        $stream.prepend('<li><div class="post-preview"><a href="#"><h3 class="post-subtitle">'+data.message+'</h3></a><p class="post-meta">Posted by <a href="#">'+data.sender+'</a> on '+data.created+'</p></div></li>');
    });

    var keyupsearch = function(keyupval) {
        $.ajax({
            type: 'POST',
            url: '/users',
            type:'json',
            data:{nick:keyupval},
            success:hata
        });
        function hata (data) {
            alert(data);
        }
    };
    $search.submit(function () {
        console.log('selam olsun sana');
        keyupsearch($search.val());
    });
});
