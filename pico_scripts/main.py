import array, time
from machine import Pin, UART
import sys
import rp2
from duck import *
from font import *

NUM_LEDS = 144
PIN_NUM = 10
brightness = 0.2
uart = UART(1, 115200)

@rp2.asm_pio(
    sideset_init=rp2.PIO.OUT_LOW,
    out_shiftdir=rp2.PIO.SHIFT_LEFT,
    autopull=True,
    pull_thresh=24
)
def ws2812():
    T1 = 2
    T2 = 5
    T3 = 3
    wrap_target()
    label("bitloop")
    out(x, 1)               .side(0)    [T3 - 1]
    jmp(not_x, "do_zero")   .side(1)    [T1 - 1]
    jmp("bitloop")          .side(1)    [T2 - 1]
    label("do_zero")
    nop()                   .side(0)    [T2 - 1]
    wrap()

sm = rp2.StateMachine(
    0,
    ws2812,
    freq=8_000_000,
    sideset_base=Pin(PIN_NUM)
)
sm.active(1)
a = array.array("I", [0 for _ in range(NUM_LEDS)])

arr_arrangement = [
    0, 135, 1, 134, 2, 117, 3, 116, 4, 99, 5, 98, 6, 81, 7, 80,
    15, 136, 14, 133, 13, 118, 12, 115, 11, 100, 10, 97, 9, 82, 8, 79,
    16, 137, 17, 132, 18, 119, 19, 114, 20, 101, 21, 96, 22, 83, 23, 78,
    31, 138, 30, 131, 29, 120, 28, 113, 27, 102, 26, 95, 25, 84, 24, 77,
    32, 139, 33, 130, 34, 121, 35, 112, 36, 103, 37, 94, 38, 85, 39, 76,
    47, 140, 46, 129, 45, 122, 44, 111, 43, 104, 42, 93, 41, 86, 40, 75,
    48, 141, 49, 128, 50, 123, 51, 110, 52, 105, 53, 92, 54, 87, 55, 74,
    63, 142, 62, 127, 61, 124, 60, 109, 59, 106, 58, 91, 57, 88, 56, 73,
    64, 143, 65, 126, 66, 125, 67, 108, 68, 107, 69, 90, 70, 89, 71, 72
    ]

def pixels_show(sleep=10):
    dimmer_ar = dimmer_ar = array.array("I", [0 for _ in range(NUM_LEDS)])
    for i,c in enumerate(a):
        r = int(((c >> 8) & 0xFF) * brightness)
        g = int(((c >> 16) & 0xFF) * brightness)
        b = int((c & 0xFF) * brightness)
        idx = arr_arrangement[i]
        dimmer_ar[idx] = (g<<16) + (r<<8) + b
    sm.put(dimmer_ar, 8)
    time.sleep_ms(sleep)

def pixels_set(i, color):
    a[i] = (color[1]<<16) + (color[0]<<8) + color[2]
    
def duck_fill(arr):
    for i in range(NUM_LEDS):
        pixels_set(i, arr[i])
    pixels_show()
        
def animate(frames, sleep_time):
    for f in frames:
        duck_fill(f)
        time.sleep(sleep_time)




from urandom import randint
import uselect
from machine import Pin, SPI, PWM, RTC
import framebuf
import time
import random
import gc
import math
from sys import stdin, exit
import micropython
import sys

# size of each letter in pixels
CHARACTER_SIZE = 8

# how serial lines are ended
TERMINATOR = "\n"
fill_string = ""

class Pico:

    def __init__(self):
        duck_fill(pride)
        self.run_loop = True

        # store incomplete lines from serial here. list of strings (no typing module in micropython)
        self.buffered_input = []
        # when we get a full line store it here, without the terminator.
        # gets overwritten if a new line is read (as early as next tick).
        # blanked each tick.
        self.input_line_this_tick = ""
        self.frame_list = []

    def main(self):

        latest_input_line = ""

        # main loop
        while self.run_loop:

            # single background per tick
            # buffer from the USB to serial port
            self.read_serial_input()

            ########################### app per tick code here


            ########################### end app per tick code here

            # simple loop speed control
            time.sleep_ms(100)

    def read_serial_input(self):
        select_result = uselect.select([stdin], [], [], 0)

        while select_result[0]:
            # there's no easy micropython way to get all the bytes.
            # instead get the minimum there could be and keep checking with select and a while loop
            input_character = stdin.read(1)

            # add to the buffer
            self.buffered_input.append(input_character)

            # check if there's any input remaining to buffer
            select_result = uselect.select([stdin], [], [], 0)

        # if a full line has been submitted
        if TERMINATOR in self.buffered_input:
            duck_fill(loading_hourglass)
            line_ending_index = self.buffered_input.index(TERMINATOR)

            # make it available
            self.input_line_this_tick = "".join(self.buffered_input[:line_ending_index])
            
            # here fill frame
            test_array = []
            rgb_array_part = self.input_line_this_tick.split("#")
            for test_str in rgb_array_part:
                res = eval(test_str)
                test_array.append(res)
            
            self.frame_list.extend(rgb_array_part)
            if len(self.frame_list) == 144:
                fill_frame=[]
                for pixel in self.frame_list:
                    p = pixel[1:-1]
                    fill_frame.append(eval(p))
                duck_fill(fill_frame)
                self.frame_list = []
            latest_input_line = self.input_line_this_tick

            # remove it from the buffer.
            # If there's remaining data, leave that part. This removes the earliest line so should allow multiple lines buffered in a tick to work.
            # however if there are multiple lines each tick, the buffer will continue to grow.
            if line_ending_index < len(self.buffered_input):
                self.buffered_input = self.buffered_input[line_ending_index + 1 :]
            else:
                self.buffered_input = []
        # otherwise clear the last full line so subsequent ticks can infer the same input is new input (not cached)
        else:
            self.input_line_this_tick = ""


    def exit(self):
        self.run_loop = False


# start the code
if __name__ == "__main__":
    pico = Pico()
    pico.main()
    # when the above exits, clean up
    gc.collect()


