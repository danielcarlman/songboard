import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateSongForm from "../components/CreateSongForm";

describe("<CreateSongForm />", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders title, lyrics and a submit button", () => {
    render(<CreateSongForm />);
    expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("lyrics")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Song" })).toBeInTheDocument();
  });

  test("shows a success message and posts the entered values", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: "11111111-1111-4111-8111-111111111111",
            userId: "22222222-2222-4222-8222-222222222222",
            title: "Title",
            lyrics: "Lyrics",
          }),
      }),
    ) as jest.Mock;

    render(<CreateSongForm />);
    await userEvent.type(screen.getByPlaceholderText("title"), "Title");
    await userEvent.type(screen.getByPlaceholderText("lyrics"), "Lyrics");
    await userEvent.click(screen.getByRole("button", { name: "Create Song" }));

    expect(await screen.findByText("Song created successfully")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/create-song",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ title: "Title", lyrics: "Lyrics" }),
      }),
    );
  });

  test("shows the server's error message on failure", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Song already exists" }),
      }),
    ) as jest.Mock;

    render(<CreateSongForm />);
    await userEvent.type(screen.getByPlaceholderText("title"), "Title");
    await userEvent.click(screen.getByRole("button", { name: "Create Song" }));

    expect(await screen.findByText("Song already exists")).toBeInTheDocument();
    expect(screen.queryByText("Song created successfully")).not.toBeInTheDocument();
  });

  test("disables the form while the request is in flight", async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    ) as jest.Mock;

    render(<CreateSongForm />);
    await userEvent.type(screen.getByPlaceholderText("title"), "Title");
    await userEvent.click(screen.getByRole("button", { name: "Create Song" }));

    expect(screen.getByPlaceholderText("title")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Create Song" })).toBeDisabled();

    await act(async () => {
      resolveFetch({
        ok: true,
        json: () =>
          Promise.resolve({
            id: "11111111-1111-4111-8111-111111111111",
            userId: "22222222-2222-4222-8222-222222222222",
            title: "Title",
            lyrics: "",
          }),
      });
    });
  });
});
