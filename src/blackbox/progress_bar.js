function setProgress(dataPerc) {
    $(function() {
        var t = $('.progressbar');
        var barperc = Math.round(dataPerc * 5.56);
        t.find('.bar').animate({width:barperc}, dataPerc * 25);

        function perc() {
            var length = t.find('.bar').css('width');
            var percent = Math.round(parseInt(length) / 5.56);
            var labelpos = (parseInt(length) - 2);
            t.find('.label').css('left', labelpos);
            t.find('.perc').text(percent + '%');
        }

        perc();
        setInterval(perc, 0);
    });
}
