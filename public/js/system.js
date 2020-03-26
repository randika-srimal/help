$(function() {
    $("#spinner").hide();
    $("#no-packs-warning").hide();
    $("#select-pack-alert").hide();

    $(document).on("click", ".card", function() {
        $("#pack_id").val($(this).attr("pack-id"));
    });

    $(".view-agent").click(function() {
        var agentName = $(this).attr("data-name");
        var agentDetails = $(this).attr("data-details");
        var packItems = $(this).attr("data-items");
        Swal.fire({
            icon: "info",
            title: agentName,
            html: '<p>'+packItems+'</p>',
            footer: agentDetails
        });
    });

    var availableTags = $("#delivery-area-names").val();

    $("#search-input").autocomplete({
        source: JSON.parse(availableTags),
        select: function(event, ui) {
            $("#card-columns").empty();
            $("#select-pack-alert").hide();
            $("#spinner").show();
            $("#area_name").val(ui.item.value);
            $.get("packs/area?area=" + ui.item.value, function(packs) {
                $("#spinner").hide();
                if (packs.length > 0) {
                    $("#no-packs-warning").hide();
                    $("#select-pack-alert").show();
                } else {
                    $("#no-packs-warning").show();
                    $("#select-pack-alert").hide();
                }
                packs.sort(function(a, b) {
                    return a.price - b.price;
                });
                var cards = "";
                packs.forEach(pack => {
                    cards +=
                        '<div class="card text-dark bg-default pack" pack-id="' +
                        pack.id +
                        '" data-toggle="modal" data-target="#order-modal">';
                    cards += '<div class="card-body" style="padding: 0.8rem;">';
                    cards +=
                        '<h5 class="card-title" style="font-weight:bold;">Rs:' +
                        pack.price +
                        "</h5>";
                    cards +=
                        '<h6 class="card-subtitle mb-2 text-muted">' +
                        pack.title +
                        "</h6>";
                    cards +=
                        '<p class="card-text" style="white-space: pre-wrap;background: #b9c3cc;padding: 0.3rem;">' +
                        pack.items +
                        "</p>";
                    cards +=
                        '<p class="card-text" style="text-align: center;font-size: 0.8rem;">' +
                        pack.user.name +
                        "," +
                        pack.user.contact_details +
                        "</p>";
                    cards += "</div>";
                    cards += "</div>";
                });

                $("#card-columns").append(cards);
            }).fail(function() {
                $("#spinner").hide();
                alert("error");
            });
        }
    });
});
