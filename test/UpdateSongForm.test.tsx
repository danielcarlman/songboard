import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateSongForm from "../components/UpdateSongForm";
import { Song } from "@/types";

const song: Song = {
  id: "song-1",
  userId: "user-1",
  title: "Original Title",
  lyrics: "Original lyrics",
};

describe("<UpdateSongForm />", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("prefills the title and lyrics from the given song", () => {
    render(<UpdateSongForm song={song} />);
    expect(screen.getByPlaceholderText("title")).toHaveValue("Original Title");
    expect(screen.getByPlaceholderText("lyrics")).toHaveValue("Original lyrics");
  });

  test("shows a success message and puts the edited values", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) }),
    ) as jest.Mock;

    render(<UpdateSongForm song={song} />);
    const titleInput = screen.getByPlaceholderText("title");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated Title");
    await userEvent.click(screen.getByRole("button", { name: "Update Song" }));

    expect(await screen.findByText("Song updated successfully")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/update-song/song-1",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ title: "Updated Title", lyrics: "Original lyrics" }),
      }),
    );
  });

  test("shows the server's error message on failure", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "This song title already exists" }),
      }),
    ) as jest.Mock;

    render(<UpdateSongForm song={song} />);
    await userEvent.click(screen.getByRole("button", { name: "Update Song" }));

    expect(
      await screen.findByText("This song title already exists"),
    ).toBeInTheDocument();
  });

  test("rejects an empty title before making a request", async () => {
    global.fetch = jest.fn() as jest.Mock;

    render(<UpdateSongForm song={song} />);
    await userEvent.clear(screen.getByPlaceholderText("title"));
    await userEvent.click(screen.getByRole("button", { name: "Update Song" }));

    // requestUpdateSong throws synchronously from schema validation, which
    // the form's catch block turns into a rejection message instead of a
    // crash; the specific wording comes from zod, so just assert no
    // successful update happened and fetch was never called.
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByText("Song updated successfully")).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  test("disables the form while the request is in flight", async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    ) as jest.Mock;

    render(<UpdateSongForm song={song} />);
    await userEvent.click(screen.getByRole("button", { name: "Update Song" }));

    expect(screen.getByPlaceholderText("title")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Update Song" })).toBeDisabled();

    await act(async () => {
      resolveFetch({ ok: true, json: () => Promise.resolve({ ok: true }) });
    });
  });
});
