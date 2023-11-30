<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeleteProduct implements ShouldBroadcast {
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $product;
    public $list;

    public function __construct($product, $list) {
        $this->product = $product;
        $this->list = $list;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn() {
        return ['shopping-list.' . $this->list->link_url];
    }

    public function broadcastAs() {
        return "ProductDeleted";
    }
}
