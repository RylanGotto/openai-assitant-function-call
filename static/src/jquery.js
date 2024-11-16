
$(window).on("load", function(){
    // Remove to do
    $(document).on("click", '.todo-item-exit', function(e){
        e.preventDefault();
        var uuid = $(this).parent('.todo-list-item').attr('data-todo-id');
        $(this).parent('.todo-list-item').remove();
        localStorage.removeItem(uuid);
    })

    // Add to do
    $("#todo-list-input").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            addTodoItem($(this).val());
        }
    });

    function generateUID() {
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }

    function addTodoItem(todo_text){
        var uuid = generateUID()
        var todo_item = '<div class="todo-list-item" data-todo-id="' + uuid + '" draggable="true">' +
                    '<h2 class="h3">' + todo_text +  '</h2>' +
                    '<a href="#" class="todo-item-exit">X</a>' +
                    '</div>';
        if (localStorage.length === 0) {
            localStorage.setItem(uuid, todo_item);
        } else {
            localStorage.setItem(uuid, todo_item)
        }
        $('#todo-list-container').append(todo_item);
    }

    function initList() {
        if (localStorage.length !== 0) {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var value = localStorage.getItem(key);
                $('#todo-list-container').append(value);
            }
        }
    }
    initList();
});