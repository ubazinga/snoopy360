<?php

header('Content-type: image/jpeg');

class Converter {

	public $spriteWidth;
	public $spriteHeight;

	public $images;

	public function __construct() 
	{
		$images = array();

		if ($handle = opendir('images')) {
		    /* Именно этот способ чтения элементов каталога является правильным. */
		    while (false !== ($file = readdir($handle))) { 
		        if($file !== '.' and $file !== '..') {
		        	$images[] = 'images' . DIRECTORY_SEPARATOR . $file;
		        }
		    }

		    closedir($handle); 
		}

		foreach ($images as $image) {
			$this->images[] = array(
				'path'      => $image,
				'resource'  => imagecreatefromjpeg($image),
				'size'      => getimagesize($image),
			);

			list($width, $this->spriteHeight) = getimagesize($image);

			if($width) {
				$this->spriteWidth += $width;
			}
		}
	}

	public function create() 
	{
		$offset = 0;
		$sprite = imagecreate($this->spriteWidth, $this->spriteHeight);

		foreach ($this->images as $image) {
			imagecopy($sprite, $image['resource'], $offset, 0, 0, 0, $image['size'][0], $image['size'][1]);
			$offset += $image['size'][0];
		}
		

		return $sprite;
	}
}

// $img1 = imagecreatefrompng("/var/....../img1.png"); 
// $img2 = imagecreatefrompng("/var/....../img2.png"); 
// imagecopyresized($res,$img1,0,0,0,0,imagesx($img1),imagesy($img1),imagesx($img1),imagesy($img1)); 
// imagecopyresized($res,$img2,0,150,0,0,imagesx($img2),imagesy($img2),imagesx($img2),imagesy($img2)); 
// imagepng($res);

// $im = @imagecreate(110, 20)
//     or die("Cannot Initialize new GD image stream");
// $background_color = imagecolorallocate($im, 0, 0, 0);
// $text_color = imagecolorallocate($im, 233, 14, 91);
// imagestring($im, 1, 5, 5,  "A Simple Text String", $text_color);
// imagepng($im);
// imagedestroy($im);


$sprite = new Converter();

imagejpeg($sprite->create());