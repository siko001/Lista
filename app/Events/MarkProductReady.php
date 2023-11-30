<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MarkProductReady implements ShouldBroadcast {
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $productId;
    public $userId;
    public $product;
    public $list;
    /**
     * Create a new event instance.
     *
     * @param int $productId
     * @param int $userId
     */
    public function __construct($productId, $userId, $product, $list) {
        $this->productId = $productId;
        $this->userId = $userId;
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

        return "MarkedAsReady";
    }
}
