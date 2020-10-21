import * as updaters from './updaters';

function connect(socket) {
    // Notification
    socket.on('notification', (data) => {
        updaters.updateNotification(data);
    })

    // bulletin
    socket.on('bulletin', (data) => {
        updaters.updateBulletin(data);
    })

    // churchRequest
    socket.on('churchRequest', (data) => {
        updaters.updateMemberRequest(data);
    })

    // comment
    socket.on('comment', (data) => {
        updaters.updateComment(data);
    })

    // reactions
    socket.on('reactions', (data) => {
        updaters.updateReaction(data);
    })

    // withdraw notification
    // socket.on('withdrawPrayer', (data) => {
    //     updaters.updateWithdrawPrayer(data);
    // })

    // share notification
    // socket.on('sharePrayer', (data) => {
    //     console.log("sharePrayer ", data)
    //     updaters.updateSharePrayer(data);
    // })

    // share notification
    socket.on('prayer', (data) => {
        updaters.updateSharePrayer(data);
    })
}

module.exports = {
    connect: connect
}