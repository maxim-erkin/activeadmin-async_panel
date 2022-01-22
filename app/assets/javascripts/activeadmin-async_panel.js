/*
To use this stuff do next steps:

1. Define async panel
if you setup 'data-period' panel will be periodically updated if not it will be loaded once after page load
 panel 'Name', class: 'async-panel', 'data-url' => path_helper, 'data-period' => 1.minute

2. Define member_action or collection action to handle request specified by path_helper
 collection_action do
   @resources = SomeResource.some_scope
   render layout: false # mandatory line, layout should be disaled to render template only
 end

3. Define you view template to render action above in file views/resource_names/action_name.html.arb (slim, erb)
 table_for resources do
   column :value1
   column :calue2
 end
*/

$(function() {
  $('.async-panel').each(function(index, item) {
    var registerHandler, requiresClick, worker;
    item = $(item);
    requiresClick = !!item.data('clickable');
    worker = function() {
      item.addClass('processing');
      $('h3', item).hide().show(0);
      $.ajax({
        url: item.data('url'),
        success: function(data) {
          $('.panel_contents', item).html(data);
        },
        error: function(data, status, error) {
          $('.panel_contents', item).html(error);
        },
        complete: function() {
          var period;
          item.removeClass('processing');
          // Schedule the next request when the current one's completed
          period = item.data('period');
          if (period) {
            setTimeout(worker, period * 1000);
          }
        }
      });
    };
    registerHandler = function() {
      item.addClass('clickable');
      $('h3', item).on('click', function() {
        $('h3', item).off('click');
        item.removeClass('clickable');
        worker();
      });
    };
    if (requiresClick) {
      registerHandler();
    } else {
      worker();
    }
  });
});
