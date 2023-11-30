<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RemoveAllProducts

implements ShouldBroadcast {
    use Dispatchable, InteractsWithSockets, SerializesModels;


    public $list;

    public function __construct($list) {

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
        return "RemoveAllProducts";
    }
}
