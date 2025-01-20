import zlib
import struct
import argparse
import xml.etree.ElementTree as ET
import os

class RecordingsFacade:

    def __init__(self, filepath, is_ee):
        self.filepath = filepath

        with open(filepath, "rb") as f:
            all = f.read()

        # Check the header magic
        magic = all[:4]
        if magic != b"l33t":
            raise ValueError("Bad magic value")

        size = struct.unpack("<I", all[4:8])[0]
        rest = all[8:]
        decomper = zlib.decompressobj()

        # Decompress data
        try:
            decomp = decomper.decompress(rest)
        except zlib.error as e:
            raise ValueError("Recording corrupt")

        # Sanity check size
        if size != len(decomp):
            raise ValueError("Error in decompression. File might be corrupted")

        self.decomp = decomp
        self.seek = 1474 if is_ee else 1466

        self.gameSettingsXml = self.read_file()

        decodedXML = self.gameSettingsXml.decode("utf-16")
        # print("Decoding game..." + filepath)
        # print(decodedXML)

    def is_game_against(self, opponent):
        root = ET.fromstring(self.gameSettingsXml)
        players = list(map(lambda x: x.find("Name").text, root.findall("Player")))

        if(self.any_equals(players, opponent)):
            print(players[0] + "-" + players[1] + ": " + self.filepath)

    def any_equals(self, array, string):
        return any(item == string for item in array)

    def read_section(self, totalSize):
        read = b""
        while totalSize > 0:
            blockSize = self.read_four()
            if blockSize == 0:
                raise ValueError("Zero block size")
            toRead = min(totalSize, blockSize)
            read += self.read_n(toRead)
            totalSize -= toRead
        return read

    def read_file(self):
        totalSize = self.read_four()
        return self.read_section(totalSize)

    def read_four(self):
        data = struct.unpack("<I", self.decomp[self.seek:self.seek+4])[0]
        self.seek += 4
        return data

    def read_one(self):
        data = struct.unpack("B", self.decomp[self.seek:self.seek+1])[0]
        self.seek += 1
        return data

    def read_two(self):
        data = struct.unpack("H", self.decomp[self.seek:self.seek+2])[0]
        self.seek += 2
        return data

    def read_n(self,n):
        data = self.decomp[self.seek:self.seek+n]
        self.seek += n
        return data

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('dirpath')
    args = parser.parse_args()

    for filename in os.listdir(args.dirpath):
        filepath = os.path.join(args.dirpath, filename)
        if os.path.isfile(filepath) and filename.endswith(".rcx"):
            RecordingsFacade(filepath, is_ee=True).is_game_against("Skelo")

if __name__ == "__main__":
    main()


