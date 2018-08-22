defmodule NegotiateWeb.PageController do
  use NegotiateWeb, :controller

  plug SetCurrentUser when action in [:index]

  def index(conn, _params) do
    render conn, "index.html"
  end
end
