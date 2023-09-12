import { useState } from 'react';
import compareImages from 'resemblejs/compareImages';
import EXIF2 from 'exifreader'
import EXIF from 'exif-js'
import { Button, Select, Slider } from '@mantine/core';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { PNG } from 'pngjs/browser';
import ExifReader from 'exifreader';

const ImageComparator = () => {
  const [image1Buffer, setImage1Buffer] = useState(null);
  const [image2Buffer, setImage2Buffer] = useState(null);
  const [imageDiff, setImageDiff] = useState(null);
  const [currentDiffType, setCurrentDiffType] = useState('flat')
  const [currentIgnoreValue, setCurrentIgnoreValue] = useState('default')
  const [exifData, setExifData] = useState(null);
  const [endValue, setEndValue] = useState(0);
  const [value, setValue] = useState(50);
  const compareImages123 = useCallback(async () => {
    if (image1Buffer && image2Buffer) {
      const img1 = await compareImages(image1Buffer, image2Buffer, {
        ignore: currentIgnoreValue && currentIgnoreValue !== 'default' ? currentIgnoreValue : currentIgnoreValue,
        output: {
          transparency: endValue * 0.01,
          errorType: currentDiffType,
        }
      })
      setImageDiff(img1.getImageDataUrl())
    }
  }, [currentDiffType, endValue, image1Buffer, image2Buffer, currentIgnoreValue]);
  useEffect(() => {
    compareImages123()
  }, [image1Buffer, compareImages123, image2Buffer, currentDiffType, endValue, currentIgnoreValue])
  const handleImage1Change = (event) => {
    loadImage(event, setImage1Buffer);
  };

  const handleImage2Change = (event) => {
    loadImage(event, setImage2Buffer);
  };

  const loadImage = async (event, setSelectedImage) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setSelectedImage(e.target.result);
      }
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }

  };



  return (
    <div>
      <Box>

      <input type="file" accept="image/*" onChange={handleImage1Change} />
      <input type="file" accept="image/*" onChange={handleImage2Change} />
      </Box>
      <Select
        onChange={(y) => {
          setCurrentIgnoreValue(y)
        }}
        value={currentIgnoreValue}
        label="Your favorite framework/library"
        placeholder="Pick one"
        data={[
          'default', 'nothing', 'less', 'antialiasing', 'colors', 'alpha'
        ].map(x => (({ label: x, value: x })))}
      />
      <Select
        onChange={(y) => {
          setCurrentDiffType(y)

        }}
        value={currentDiffType}
        label="Your favorite framework/library"
        placeholder="Pick one"
        data={[
          'flat', 'movement', 'flatDifferenceIntensity', 'movementDifferenceIntensity', 'diffOnly'
        ].map(x => (({ label: x, value: x })))}
      />
      <Slider value={value} onChange={setValue} onChangeEnd={(x) => {
        console.log(x)
        setEndValue(x)
        compareImages123()
      }} />
      <Button onClick={compareImages123}>Compare Images</Button>
      {imageDiff && <img src={imageDiff} alt="Image Difference" />}
    </div>
  );
}

export default ImageComparator;
