defmodule EditPresence do
  @users %{
    "user:1" => %{
      metas: [
        %{items: [9, 6], phx_ref: "7lIPkep6wHQ=", user_id: 1, username: "Tom"}
      ]
    },
    "user:2" => %{
      metas: [
        %{items: [9, 5], phx_ref: "kXk5XLHUK/w=", user_id: 2, username: "Bob"}
      ]
    }
  }

  def update_map do
    map = find_map(2)
    new_items =
      map.items
      |> Enum.map fn(x) -> x + 1 end
    Map.replace!(map, :items, new_items)
  end

  def find_map(user_id) do
    user = @users
    |> Map.get "user:#{user_id}"
    List.first(user.metas)
    end

end
