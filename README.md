# buugetschedule

A customizable university timetable website for Burapha University students.

**buugetschedule** retrieves timetable data from REG BUU and presents it in a clean, responsive, and customizable interface. The project is independent and is not an official Burapha University service.

## Project status

The repository has been initialized. The current project baseline is the approved **Master Development Prompt V1.3** in [`docs/MASTER_PROMPT.md`](docs/MASTER_PROMPT.md).

Implementation has not yet been started. Technical decisions must be made after inspecting the actual repository, framework, existing code, and REG BUU integration requirements. Do not replace the real REG BUU integration with mock data.

## Product scope

- REG BUU authentication and timetable synchronization
- Grid and List timetable views
- Responsive desktop, tablet, and mobile layouts
- Mobile timetable scrolling and pinch-to-zoom
- Theme Studio with four predefined themes and detailed customization
- PNG and PDF timetable export
- About and Changelog pages

See the [Master Development Prompt](docs/MASTER_PROMPT.md) for the full product requirements, behavior rules, design values, edge cases, and implementation constraints.

## Core principles

1. Preserve existing working functionality when modifying the project.
2. Inspect the codebase and data flow before choosing or changing implementation details.
3. Never invent REG BUU endpoints, response schemas, course identifiers, or authentication behavior.
4. Treat incomplete or failed synchronization as an error; never replace valid timetable data with an incomplete response.
5. Keep authentication credentials out of persistent storage.
6. Implement and test in phases, with regression checks after each phase.

## Development

No framework, package manager, or run command is prescribed yet. Determine these from the actual project files before documenting or changing setup instructions.

## Privacy and disclaimer

REG BUU credentials are used only for authentication and must not be stored. Timetable information is fetched from REG BUU when synchronization occurs.

buugetschedule is an independent project and is not affiliated with, endorsed by, or an official service of Burapha University. Users should verify important timetable information through official university channels.

## License

No license has been selected yet.
