import { transformAll } from '@angular/compiler/src/render3/r3_ast';
import { Component, HostListener, OnInit } from '@angular/core';
import * as snapsvg from 'snapsvg';
import 'snapsvg-cjs';
declare var Snap: any;
declare var mina: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'test-svg';
  zoomLevel = {
    lowest: 1,
    highest: 8,
    current: 1
  };

  translate = {
    v: 0,
    h: 0
  };

  s: snapsvg.Paper;

  @HostListener("window:keyup.arrowup", ['event'])
  ArrowUpEvent(event: KeyboardEvent) {
    this.move("up")
  }
  @HostListener("window:keyup.arrowdown", ['event'])
  ArrowDownEvent(event: KeyboardEvent) {
    this.move("down")
  }
  @HostListener("window:keyup.arrowleft", ['event'])
  ArrowLeftEvent(event: KeyboardEvent) {
    this.move("left")
  }
  @HostListener("window:keyup.arrowright", ['event'])
  ArrowRightEvent(event: KeyboardEvent) {
    this.move("right")
  }
  @HostListener("window:keyup.-", ['event'])
  MinusEvent(event: KeyboardEvent) {
    this.zoom("out")
  }
  @HostListener("window:keyup.+", ['event'])
  PlusEvent(event: KeyboardEvent) {
    this.zoom("in")
  }

  ngOnInit() {
    this.s = Snap("#world-map");
    Snap.load('/assets/img/world-map.svg', (svg => {
      let worlMap: snapsvg.Fragment = svg;
      worlMap.selectAll(".continent").forEach(continent => {
        continent.hover(e => {
          continent.attr({
            fill: "#ec008c",
            stroke: "#000",
            strokeWidth: 1
          })

          continent.click(e => {
            console.log(continent.attr("name"));
          })
        }, e => {
          continent.attr({
            fill: "#B2B2B2",
            strokeWidth: 0
          })
        });
      })
      this.s.append(worlMap.select('svg'));
    }))

  }

  move(direction) {
    let matrix: snapsvg.Matrix = new Snap.Matrix();
    switch (direction) {
      case 'up':
        this.translate.h -= 10;
        break;
      case 'down':
        this.translate.h += 10;
        break;
      case 'left':
        this.translate.v -= 10;
        break;
      case 'right':
        this.translate.v += 10;
        break;
      default:
        break;
    }

    this.applySVGTransform(matrix);
  }


  zoom(direction) {
    let matrix: snapsvg.Matrix = new Snap.Matrix();
    let nextZoomLevel = this.zoomLevel.current;
    switch (direction) {
      case 'in':
        nextZoomLevel += 0.25;
        nextZoomLevel = nextZoomLevel > this.zoomLevel.highest ? this.zoomLevel.highest : nextZoomLevel;
        this.zoomLevel.current = nextZoomLevel;
        break;
      case 'out':
        nextZoomLevel -= 0.25;
        nextZoomLevel = nextZoomLevel < this.zoomLevel.lowest ? this.zoomLevel.lowest : nextZoomLevel;
        this.zoomLevel.current = nextZoomLevel;
        break;
      default:
        break;
    }

    this.applySVGTransform(matrix);
  }

  applySVGTransform(matrix: snapsvg.Matrix) {
    matrix.scale(this.zoomLevel.current);
    matrix.translate(this.translate.v, this.translate.h);
    this.s.select("svg").select("g").animate({transform: matrix}, 700, mina.easeinout);
  }
}
