<?
require('simple_html_dom.php');
$html = file_get_html('/Users/jonny/Sites/testing/htmlscrambler/sample.html');

$a = array();
recurse($html->find('*'));

function recurse($theNode) {
	foreach ($theNode as $n) {
		if (count($n->children)) {
			recurse($n->children);
			if ($n->innertext) {
				print $n->innertext . "\n\n";
				preg_match_all('/>([^<>]*)</', $n->innertext, $m);
				print_r($m);
			}
		} else {

			if ($n->innertext) {
				print '***' . $n->innertext . "\n\n";
				preg_match_all('/>([^<>]*)</', $n->innertext, $m);
				print_r($m);
			}

		}
	}
}