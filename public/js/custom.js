$(function () {

  let socket = io();

  $('#sendWoof').submit(function () {
    let content = $('#woof').val();
    socket.emit('woof', { content: content });
    $('#woof').val();
    return false;
  });

  socket.on('incomingWoof', function (data) {
    let html = '';
    html += `
    <div class="media">
      <div class="media-left">
        <a href="/user/${data.user._id}">
          <img src="${ data.user.photo}" alt="photo" class="media-object">
        </a>
      </div>
      <div class="media-body pl-3">
        <h4 class="media-heading">${ data.user.name}</h4>
        <p>${data.data.content}</p>
      </div>
    </div>
    `;

    $('#woofs').prepend(html);

  });
});