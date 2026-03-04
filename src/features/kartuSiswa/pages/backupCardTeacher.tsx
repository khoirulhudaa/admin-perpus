const { 
    data: teachers,
  } = useBiodataGuruForCard();
  // Total data untuk opsi select
  const totalData = teachers?.data?.length || 0;


    const generateOptions = (max: number, isEndIndex: boolean = false) => {
      const options = [];
      for (let i = 1; i <= max; i++) {
        let disabled = false;
        if (isEndIndex) {
          // Untuk endIndex, disable jika kurang dari startIndex atau melebihi startIndex + 9
          const start = Number(startIndex);
          disabled = i < start || i > Math.min(start + 9, totalData);
        }
        options.push(
          <SelectItem key={i} value={String(i)} disabled={disabled}>
            {i}
          </SelectItem>
        );
      }
      return options;
    };


    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px" }}>
              <label className="text-white">Jumlah Kartu:</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-white">Dari:</label>
                  <Select value={startIndex} onValueChange={handleStartIndexChange}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Pilih Awal" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateOptions(totalData)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-white">Sampai:</label>
                  <Select value={endIndex} onValueChange={handleEndIndexChange}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Pilih Akhir" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateOptions(totalData, true)}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Cetak PDF
                </button>
              </div>
            </div>


   <MultiCardForTeacher
              searchKelas={searchKelas}
              schoolId={schoolId}
              selectedBackgroundFront={selectedBackgroundFront}
              selectedBackgroundBack={selectedBackgroundBack}
              orientation={cardOrientation}
              startIndex={Number(startIndex)}
              endIndex={Number(endIndex)}
            />