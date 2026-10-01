<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- Keep bilingual copy, navigation, contact placeholders, and catalog data centralized in `src/lib/site-data.ts` so future CRM integration has one stable content boundary.
- Keep language state in the shared root layout and persist the selected locale after hydration to avoid server/client rendering mismatches.