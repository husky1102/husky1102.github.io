import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts import subset_site_font


class CheckGeneratedTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        self.public_font = Path(self.temp_dir.name) / "committed.woff2"

    def test_matching_generated_font_passes_and_cleans_up(self):
        self.public_font.write_bytes(b"matching-font")
        generated_paths = []

        def generate(_expected, target, source_font):
            self.assertEqual(source_font, subset_site_font.SOURCE_FONT)
            target.write_bytes(b"matching-font")
            generated_paths.append(target)

        with (
            mock.patch.object(subset_site_font, "generate", side_effect=generate),
            mock.patch.object(subset_site_font, "verify") as verify,
        ):
            subset_site_font.check_generated({0x4E2D}, public_font=self.public_font)

        verify.assert_called_once_with({0x4E2D}, self.public_font)
        self.assertEqual(len(generated_paths), 1)
        self.assertFalse(generated_paths[0].exists())

    def test_generated_content_drift_fails_and_cleans_up(self):
        self.public_font.write_bytes(b"committed-font")
        generated_paths = []

        def generate(_expected, target, source_font):
            self.assertEqual(source_font, subset_site_font.SOURCE_FONT)
            target.write_bytes(b"drifted-font")
            generated_paths.append(target)

        with (
            mock.patch.object(subset_site_font, "generate", side_effect=generate),
            mock.patch.object(subset_site_font, "verify") as verify,
        ):
            with self.assertRaisesRegex(SystemExit, "generated font differs from committed font"):
                subset_site_font.check_generated({0x4E2D}, public_font=self.public_font)

        verify.assert_called_once_with({0x4E2D}, self.public_font)
        self.assertEqual(len(generated_paths), 1)
        self.assertFalse(generated_paths[0].exists())


if __name__ == "__main__":
    unittest.main()
