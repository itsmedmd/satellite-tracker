const data = [
"1 37846U 11060A   22076.15736522 -.00000068  00000+0  00000+0 0  9997",
"2 37846  56.9639  23.8454 0004131 352.6317   7.3440  1.70475042 64648",
"1 37847U 11060B   22075.09826889 -.00000069  00000+0  00000+0 0  9997",
"2 37847  56.9643  23.8737 0005316 330.2485 146.2859  1.70475405 64631",
"1 38857U 12055A   22076.19765892  .00000027  00000+0  00000+0 0  9995",
"2 38857  55.1091 144.2350 0004510 259.1933 100.8369  1.70473678 58671",
"1 38858U 12055B   22074.99475085  .00000018  00000+0  00000+0 0  9994",
"2 38858  55.1089 144.2695 0002095 248.7502 111.3002  1.70473955 58515",
"1 40128U 14050A   22076.04036034 -.00000064  00000+0  00000+0 0  9991",
"2 40128  50.3385 335.9655 1630343 120.7125 256.3553  1.85519246 49503",
"1 40129U 14050B   22076.30169746 -.00000063  00000+0  00000+0 0  9997",
"2 40129  50.3648 335.0128 1627401 121.5297 255.3880  1.85519827 51670",
"1 40544U 15017A   22076.52500209 -.00000068  00000+0  00000+0 0  9994",
"2 40544  56.7593  23.8811 0004015 284.6552  75.2826  1.70475678 42730",
"1 40545U 15017B   22076.19105433 -.00000069  00000+0  00000+0 0  9999",
"2 40545  56.7648  23.9023 0003233 274.3839  85.5613  1.70475523  5773",
"1 40889U 15045A   22075.95820744  .00000047  00000+0  00000+0 0  9998",
"2 40889  55.6861 264.5150 0006007  29.0665 330.9677  1.70473453 40537",
"1 40890U 15045B   22076.17898357  .00000046  00000+0  00000+0 0  9999",
"2 40890  55.6848 264.5047 0004152  26.6486 333.3719  1.70473535 40560",
"1 41174U 15079A   22076.35419439  .00000028  00000+0  00000+0 0  9992",
"2 41174  55.1251 143.9334 0004328 301.6504  58.3899  1.70474681 38888",
"1 41175U 15079B   22077.16023484  .00000033  00000+0  00000+0 0  9990",
"2 41175  55.1238 143.9100 0003650 299.7129  60.3376  1.70474982 38890",
"1 41549U 16030A   22076.69309608  .00000045  00000+0  00000+0 0  9998",
"2 41549  55.8294 264.4139 0004045 359.4059   0.5894  1.70474931 36185",
"1 41550U 16030B   22075.22604742  .00000049  00000+0  00000+0 0  9999",
"2 41550  55.8302 264.4557 0002241 339.0854  20.9106  1.70475135 36172",
"1 41859U 16069A   22076.64664768  .00000030  00000+0  00000+0 0  9994",
"2 41859  54.7850 144.1293 0004617 287.9327  72.1007  1.70473610 33156",
"1 41860U 16069B   22075.91346910  .00000025  00000+0  00000+0 0  9995",
"2 41860  54.7828 144.1474 0003049 308.5248  51.5271  1.70473666 33171",
"1 41861U 16069C   22076.27894018  .00000027  00000+0  00000+0 0  9995",
"2 41861  54.7851 144.1424 0004447 266.6746  93.3560  1.70473774 33044",
"1 41862U 16069D   22075.83943345  .00000024  00000+0  00000+0 0  9992",
"2 41862  54.7834 144.1492 0003533 269.0970  90.9412  1.70473803 33167",
"1 43055U 17079A   22074.57041273  .00000051  00000+0  00000+0 0  9999",
"2 43055  55.8065 264.3062 0001689 348.7059  11.2986  1.70474249 26486",
"1 43056U 17079B   22076.62243638  .00000045  00000+0  00000+0 0  9990",
"2 43056  55.8056 264.2494 0002859 314.2920  45.6803  1.70474334 26530",
"1 43057U 17079C   22075.66949496  .00000048  00000+0  00000+0 0  9992",
"2 43057  55.8032 264.2755 0003088 334.3873  25.5995  1.70474267 26501",
"1 43058U 17079D   22075.88949826  .00000047  00000+0  00000+0 0  9993",
"2 43058  55.8044 264.2668 0003039 304.1095  55.8623  1.70474276 26532",
"1 43564U 18060A   22075.78756926 -.00000069  00000+0  00000+0 0  9997",
"2 43564  57.1418  23.6933 0005015 296.4934  63.4370  1.70475538 22685",
"1 43565U 18060B   22076.59400363 -.00000068  00000+0  00000+0 0  9998",
"2 43565  57.1443  23.6717 0004862 304.9013  55.0352  1.70475480 22746",
"1 43566U 18060C   22076.22798828 -.00000068  00000+0  00000+0 0  9995",
"2 43566  57.1447  23.6836 0004563 306.8703  53.0698  1.70475522 22713",
"1 43567U 18060D   22074.68827400 -.00000070  00000+0  00000+0 0  9996",
"2 43567  57.1444  23.7260 0004713 301.1296  58.8063  1.70475592 22676",
"1 49809U 21116A   22076.60339410 -.00000068  00000+0  00000+0 0  9997",
"2 49809  57.1374  23.5730 0001358 274.2388 270.9927  1.70475623  1710",
"1 49810U 21116B   22076.40985394 -.00000068  00000+0  00000+0 0  9995",
"2 49810  57.1376  23.5763 0001244 305.0084 233.9338  1.70475598  1738",
];

export default data;