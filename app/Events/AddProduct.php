<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AddProduct implements ShouldBroadcast {
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $product;
    public $list;
    public $productId;
    public $userId;

    public function __construct($productId, $userId, $product, $list) {
        $this->product = $product;
        $this->list = $list;
        $this->productId = $productId;
        $this->userId = $userId;
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
        return "ProductAdded";
    }
}
