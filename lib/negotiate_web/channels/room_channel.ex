defmodule  NegotiateWeb.RoomChannel do
  use NegotiateWeb, :channel

  alias Negotiate.Repo

  def join(name, _auth, socket) do
    send(self, :after_join)
    {int_id, _} = Integer.parse(socket.assigns[:current_user_id])
    user = Negotiate.Accounts.get_user(socket.assigns[:current_user_id])
    {:ok, %{current_user_id: socket.assigns[:current_user_id], current_user_name: user.name, items: [int_id, 3, 4, 5]} , socket}
  end

  def handle_info(:after_join, socket) do
    push socket, "presence_state", NegotiateWeb.Presence.list(socket)

    user = Negotiate.Accounts.get_user(socket.assigns[:current_user_id])

    {:ok, _} = NegotiateWeb.Presence.track(socket, "user:#{user.id}", %{
      user_id: user.id,
      username: user.name,
    })
    {:noreply, socket}
  end


  def handle_in(name, %{"msg" => message}, socket) do
    broadcast!(socket, "message:new", %{msg: message})
    {:reply, :ok, socket}
  end

  def handle_in(name, %{"to" => to_id, "item" => item}, socket) do
    broadcast!(socket, "message:transfer", %{from_id: socket.assigns[:current_user_id], to_id: to_id, item: item})

    {:reply, :ok, socket}
  end


end

# @derive {Poison.Encoder, only: [:content]}