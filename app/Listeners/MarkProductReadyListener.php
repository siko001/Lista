<?php

namespace App\Listeners;

use App\Events\MarkProductReady;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class MarkProductReadyListener implements ShouldQueue {
    /**
     * Handle the event.
     *
     * @param  MarkProductReady  $event
     * @return void
     */
    public function __construct() {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MarkProductReady $event) {
        // Update your database or perform any necessary actions
        // For example, update the product status as ready in the database
        // $event->productId and $event->userId are accessible here
        info($event);
        // Broadcast the event to the private channel
        broadcast(new MarkProductReady($event->productId, $event->userId));
    }
}
