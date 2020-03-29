import React from "react"

import classnames from "classnames"
import useCurrentWitdh from "../../utils/useCurrentWitdh"

//
// images: array of image. { url, title }
//
export default function Carousel({ images = [], height, onClickRoot }) {
  const [width, setWidth] = React.useState(0)
  const [isHoverMode, setIsHoverMode] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const windowWidth = useCurrentWitdh()

  const nbImages = images.length

  const rootRef = React.useRef(null)

  //
  // set isHoverMode to true and hide it after some time
  //
  let timeoutId = null
  const activateHoverMode = () => {
    setIsHoverMode(true)
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      setIsHoverMode(false)
    }, 600)
  }

  //
  // currentIndex utilities
  //

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(nbImages - 1)
    }
  }

  const next = () => {
    if (currentIndex + 1 === nbImages) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  //
  // window resize handling
  //

  // retrieve our carousel width
  // we use the windowWidth to recalculate our element width when the window width changed
  // (is resized).
  React.useEffect(() => {
    setWidth(rootRef.current?.offsetWidth || 0)
  }, [rootRef.current, setWidth, windowWidth])

  //
  // keyboard shortcuts handling
  //

  const handleKeyDown = React.useCallback(
    e => {
      // arrow up/down button should select next/previous list element.
      // we also use vim-keys (h,j,k,l)
      if (
        // up
        e.keyCode === 38 ||
        // left
        e.keyCode === 37 ||
        // h
        e.keyCode === 72 ||
        // k
        e.keyCode === 75
      ) {
        previous()
      } else if (
        // down
        e.keyCode === 40 ||
        // right
        e.keyCode === 39 ||
        // j
        e.keyCode === 74 ||
        // l
        e.keyCode === 76
      ) {
        next()
      }

      activateHoverMode()
    },
    [setIsHoverMode, setCurrentIndex, currentIndex]
  )

  // TODO: for now we add a listener for the whole document, maybe we would want to reduce it only
  //  when we hover the carousel?
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  //
  //
  //

  return (
    <div
      ref={rootRef}
      role="presentation"
      className="relative cursor-pointer text-center overflow-hidden"
      // allow parent to define a custom onClickRoot. By default we display the next image on click
      onClick={onClickRoot || next}
      onMouseEnter={activateHoverMode}
      onMouseLeave={() => setIsHoverMode(false)}
    >
      <div
        className="flex carousel-slides"
        style={{
          transitionDuration: "0.25s",
          transform: `translateX(-${currentIndex * width}px)`,
        }}
      >
        {images.map(image => (
          <div
            key={image.url}
            className="flex relative justify-center items-center w-full"
            style={{
              height,
              scrollSnapAlign: "start",
              flexShrink: "0",
              transformOrigin: "center center",
              transform: "scale(1)",
              transition: "transform 0.5s",
            }}
          >
            <img
              src={image.url}
              alt={image.title}
              // - pointer-events-none remove events. For example it avoids pinterest browser plugin
              // to appear on the image.
              // - select-none avoid "text selection" on image.
              className="pointer-events-none select-none w-full object-cover"
            />
          </div>
        ))}
      </div>
      <div
        className={classnames("flex absolute w-full bottom-0", {
          invisible: !isHoverMode,
        })}
        style={{
          background: "rgba(0, 0, 0, 0.25",
          transition: ".85s all ease-in",
          transform: "translateY(0px)",
        }}
      >
        {images.map((image, index) => {
          const isCurrent = index === currentIndex

          return (
            <div key={image.url} className="flex flex-auto p-1">
              <div
                className="rounded-full w-full"
                style={{
                  height: "2px",
                  background: !isCurrent ? "hsla(0,0%,100%,0.5)" : "white",
                }}
              />
            </div>
          )
        })}
      </div>

      {/* 
          Display invisible tile on top of the image. One tile per image, allowing us to scroll to 
          the image corresponding to the tile the mouse is hover 
      */}
      {images.map((image, index) => {
        const tileWidth = width / images.length

        return (
          <div
            key={image.url}
            onMouseEnter={() => {
              activateHoverMode()
              setCurrentIndex(index)
            }}
            className="absolute select-none inset-y-0"
            style={{
              left: index * tileWidth,
              width: tileWidth,
            }}
          />
        )
      })}
    </div>
  )
}
