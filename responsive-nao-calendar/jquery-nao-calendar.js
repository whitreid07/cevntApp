(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS style for Browserify
    module.exports = factory;
  } else {
    // Browser globals
    factory(jQuery);
  }
}(
  /**
   * @param {jQuery} $
   */
  function ($) {
    // disable drop open behavior
    $('html').on('dragover drop', function (e) { e.preventDefault() });

    $.fn.scrollbars = function (a, b, c) {
      if (window.isMobile || window.isTouch) {//} && window.isTouch) {
        switch (a) {
          case 'scrollTo':
            return this.scrollTop(b);
          // case 'update':
          // 	return this.mCustomScrollbar('update');
          case '':
            return this;
          default:
            console.log('SCROLLBARS: ', a, b, c)
            if (typeof a == 'object' && typeof b == 'undefined') {
              this.css('overflow', 'auto')
            }
            return this;
        }
      } else {
        return this.mCustomScrollbar(a, b, c);
      }
    }

    $.fn.calendar = function (opt, val) {
      let self = this;
      if (typeof opt === 'string' && typeof val !== 'undefined') switch (opt) { // setter | method with args

        // return this;
      }
      else if (typeof opt === 'string') switch (opt) { // getter | method with no args
        // return;
      }
      let def = {
        date: new Date(),
        autoSelect: false,
        select: function (date) { },
        toggle: function (y, m) { },
      }
      let current = {
        y: def.date.getFullYear(),
        m: def.date.getMonth() + 1,
        d: def.date.getDate(),
      }
      let selected = {
        y: 0,
        m: 0,
        d: 0,
      }
      $(this).prop('selected', selected);
      def = $.extend(def, opt);
      let weekDays = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');
      let yearMonths = 'January February March April May June July August September October November December'.split(' ');
      let yearMonthsShort = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
      let today = new Date();
      let todayDate = today.getDate();
      let makeMonth = function (y, m, d) {
        let body = $('<table>')
          .addClass('month-body')
        // .appendTo(month)
        let week = $('<thead>')
          .addClass('month-week')
          .appendTo(body)
          .append('<tr></tr>')
          .find('tr')
        let days = $('<tbody>')
          .addClass('month-days')
          .appendTo(body)
        for (i = 0; i < 7; i++) {
          week.append('<th>' + weekDays[i] + '</th>');
        }
        let date = new Date(y, m - 1, 1);
        let today = new Date();
        let todayDate = today.getDate();
        let thisMonth = !!(today.getMonth() + 1 === m && today.getFullYear() === y);
        // date.setFullYear(y,m-1,1);
        let numDays = (new Date(y, m, 0)).getDate();
        let numWeeks = Math.ceil((numDays + date.getDay()) / 7);
        let day = 1;
        // console.log(date.getDay(), date.getMonth(), numDays);
        // for(let i=0; i<numWeeks; i++) {
        for (let i = 0; i < 6; i++) {
          let wk = $('<tr>').appendTo(days);
          for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < date.getDay()) || (day > numDays)) {
              wk.append('<td></td>')
              // wk.append('<td class="fade"> - </td>')
              // continue;
            } else {
              $('<td>')
                .text(day < 10 ? '0' + day : day)
                // .addClass(day === d ? 'active' : '')
                .addClass(thisMonth && day === todayDate ? 'today' : '')
                .attr('data-date', day)
                // .ripple({ type: 'icon' })
                .appendTo(wk)
                .click(function (e) {
                  $(this).parent().parent().find('.active').removeClass('active')
                  $(this).addClass('active')
                  selectDate(y, m, parseInt($(this).attr('data-date')))
                })
              day++;
            }
          }
          // if(wk.text().trim() === '' && days.children(':first').text().split(' ').join('').split('0').join('').length === 7) wk.prependTo(days);
          if (i === 5 && days.children(':first').text().split(' ').join('').split('0').join('').length === 7) wk.prependTo(days);
        }
        // days.find('td[data-date]').ripple({ type: 'centered' })
        days.find('td[data-date]').ripple()
        if (def.autoSelect) {
          days.find('td[data-date="' + d + '"]').click()//.addClass('active')
        }
        return body;
      }
      let selectDate = function (y, m, d) {
        selected.d = d;
        selected.m = m;
        selected.y = y;
        let dt = new Date(y, m - 1, d);
        def.select.bind(self)(dt);
      }
      let bringMonth = function (p_n, y, m, d) {
        isMoving = true;
        month.addClass('no-overflow');
        yMon.text(yearMonths[m - 1] + ' ' + y)
        yrnm.text(y)
        yrbd.find('.active').removeClass('active')
        yrbd.find('[data-month="' + m + '"]').addClass('active')
        if (d === null && y === selected.y && m === selected.m) d = selected.d;
        let mon = makeMonth(y, m, d)
          .addClass(p_n)
          .insertBefore(body)
        def.toggle.bind(self)(current.y, current.m);
        // requestAnimationFrame(function() {
        setTimeout(function () {
          mon.addClass('come')
        }, 1000 / 60)
        body.one('transitionend', function (e) {
          body.remove()
          body = mon;
          body.removeClass(p_n + ' come')
          month.removeClass('no-overflow');
          // def.toggle.bind(self)(current.y, current.m);
          isMoving = false;
        })
      }
      let showYearPicker = function (e) {
        year.addClass('visible')
      }
      let hideYearPicker = function (e) {
        year.removeClass('visible')
      }
      let isMoving = false;
      let date = def.date;
      // let month = $('<div>')
      let month = $(this[0])
        .addClass('nao-month')
      // .appendTo(dpkr)
      let btn1 = $('<button>')
        .addClass('ic ic-arrow-angle-left')
        .ripple()
        .attr('title', 'Previous month')
        .click(function (e) {
          e.preventDefault();
          if (isMoving) return;
          current.m = current.m - 1 === 0 ? 12 : current.m - 1;
          current.y = current.m === 12 ? current.y - 1 : current.y;
          bringMonth('prev', current.y, current.m, null);
        })
        .focus(hideYearPicker)
      let btn2 = $('<button>')
        .addClass('ic ic-arrow-angle-right')
        .ripple()
        .attr('title', 'Next month')
        .click(function (e) {
          e.preventDefault();
          if (isMoving) return;
          current.m = current.m + 1 === 13 ? 1 : current.m + 1;
          current.y = current.m === 1 ? current.y + 1 : current.y;
          bringMonth('next', current.y, current.m, null);
        })
        .focus(hideYearPicker)
      let btn3 = $('<button>')
        .addClass('btn ic ic-arrow-circle-angle-down')
        .ripple()
        .attr('title', 'View current month')
        .click(function (e) {
          e.preventDefault();
          if (isMoving) return;
          let dt = new Date();
          if (dt.getFullYear() === current.y && dt.getMonth() + 1 === current.m) return;
          let dr = current.y * 12 + current.m > dt.getFullYear() * 12 + dt.getMonth() + 1 ? 'prev' : 'next';
          current.y = dt.getFullYear();
          current.m = dt.getMonth() + 1;
          bringMonth(dr, current.y, current.m, null);
        })
        .focus(hideYearPicker)
      let btn4 = $('<button>')
        .addClass('btn ic ic-target')
        .ripple()
        .attr('title', 'View selected date')
        .click(function (e) {
          e.preventDefault();
          if (isMoving) return;
          if (selected.d < 1) return;
          if (selected.y === current.y && selected.m === current.m) return;
          let dr = current.y * 12 + current.m > selected.y * 12 + selected.m ? 'prev' : 'next';
          current.y = selected.y;
          current.m = selected.m;
          bringMonth(dr, current.y, current.m, null);
        })
        .focus(hideYearPicker)
      let yMon = $('<div>')
        .text(yearMonths[date.getMonth()] + ' ' + date.getFullYear())
        .attr('title', 'Select year and month')
        .click(showYearPicker)
      let head = $('<div>')
        .addClass('month-head')
        // .text(yearMonths[date.getMonth()]+' '+date.getFullYear())
        .append(btn1)
        .append(btn3)
        .append(btn2)
        .append(btn4)
        .append(yMon)
        .appendTo(month)
      let body = makeMonth(current.y, current.m, (opt && opt.date) ? current.d : null)
        .appendTo(month)
      let togg = def.toggle.bind(self)(current.y, current.m);
      let year = $('<div>')
        .addClass('year-month')
        .prependTo(month)
      let yrnx = $('<button>')
        // .addClass('span')
        .addClass('ic ic-arrow-angle-right')
        .ripple()
        .click(function (e) {
          e.preventDefault();
          if (isMoving) return;
          current.y++;
          yrnm.text(current.y)
          bringMonth('next', current.y, current.m, null);
        })
        .focus(showYearPicker)
      let yrpv = $('<button>')
        // .addClass('span')
        .addClass('ic ic-arrow-angle-left')
        .ripple()
        .click(function (e) {
          e.preventDefault();
          if (isMoving) return;
          current.y--;
          yrnm.text(current.y)
          bringMonth('prev', current.y, current.m, null);
        })
        .focus(showYearPicker)
      let yrnm = $('<div>')
        .text(current.y)
        .attr('title', 'Go back to calendar')
        .click(hideYearPicker)
      let yrhd = $('<div>')
        .addClass('month-head')
        // .addClass('year-head')
        .append(yrpv)
        .append(yrnx)
        .append(yrnm)
        .appendTo(year)
      let yrbd = $('<table>')
        .addClass('year-body')
        .appendTo(year)
        .html('<tbody></tbody>')
        .find('tbody')
      let yrft = $('<div>')
        .addClass('year-footer ic ic-arrow-circle-angle-up')
        // .text('okay')
        .attr('title', 'Go back to calendar')
        .ripple()
        .appendTo(year)
        .click(function (e) {
          year.removeClass('visible')
        })
      for (let i = 0; i < 4; i++) {
        let row = $('<tr>').appendTo(yrbd)
        for (let j = 0; j < 3; j++) {
          let idx = i * 3 + j;
          let col = $('<td>')
            .text(yearMonths[idx])
            .attr('data-month', idx + 1)
            .addClass(current.m === idx + 1 ? 'active' : '')
            .appendTo(row)
            .ripple()
            .click(function (e) {
              if (isMoving) return;
              let mm = parseInt($(this).attr('data-month'))
              if (mm == current.m) return;
              let dr = current.m > mm ? 'prev' : 'next';
              current.m = mm;
              $(this).parent().parent().find('.active').removeClass('active')
              $(this).addClass('active')
              bringMonth(dr, current.y, current.m, null);
            })
        }
      }
      return this;
    }
    return $;
  }));