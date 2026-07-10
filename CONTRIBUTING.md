Contributions are welcome! 

Please add issues and make pull requests. There are no stupid questions. All ideas are welcome. This is a volunteer project. Be excellent to each other.

Bug reports and feature requests to the template  should be [submitted via GitHub](https://github.com/academicpages/academicpages.github.io/issues/new/choose). For questions concerning how to style the template, please feel free to start a [new discussion on GitHub](https://github.com/academicpages/academicpages.github.io/discussions).

Fork from master and go from there. Remember that this repository is intended to remain a generic, ready-to-fork template that demonstrates the features of academicpages.

Ruby dependencies are locked in `Gemfile.lock` so local builds and GitHub Actions resolve the same versions. CI uses Ruby 3.3, and the lockfile is maintained with Bundler 2.4.22. Install that Bundler version when needed, run `bundle _2.4.22_ install` for normal setup, and use `bundle _2.4.22_ update` only as an explicit dependency-maintenance change followed by the full site verification suite.

The published LXGW webfont is generated from the source-only font under `scripts/assets/fonts/`. After changing Chinese page or UI copy, regenerate and verify the subset with:

```bash
python3 scripts/subset_site_font.py
python3 scripts/subset_site_font.py --check
```

The script requires FontTools with WOFF2 support. The full font stays under the Jekyll-excluded `scripts/` tree and must not be referenced by public CSS.

The sidebar avatar follows the same source-only rule. Regenerate the public 640px transparent WebP with:

```bash
cwebp -q 82 -alpha_q 100 -m 6 -resize 640 640 scripts/assets/images/avatar-gpt063-source.png -o images/avatar-gpt063.webp
```

After exporting, confirm that the WebP still has an alpha channel and remains within the budget in `tests/asset-budget.test.js`.
