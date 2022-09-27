import java.util.ArrayList;

import java.lang.Math;

public class TorusMap extends Map {
	private double largeRadius, smallRadius;
	private double[] spaceDimensions;
	
	public TorusMap(double R, double r, double baseAltitudeResolution, double altitudeNoiseType, double baseTemperatureResolution, double temperatureNoiseType) {
		super(baseAltitudeResolution, altitudeNoiseType, baseTemperatureResolution, temperatureNoiseType);
		
		largeRadius = R;
		smallRadius = r;
		
		setSizeRatio();
		
		spaceDimensions = new double[] {2 * (R + r), 2 * r, 2 * (R + r)};
	}
	
	public double getAltitude(double x, double y) {
		double[] coords = getFullCoords(x, y);
		
		double val = 0;
		double scale = 1;
		
		for (int i = 0; scale > 0.1 * zoom; i++) {
			if (altitudeNoiseType == POWER_OF_TWO) scale *= 0.5;
			else if (altitudeNoiseType == FACTORIAL) scale /= i + 1;
			else if (altitudeNoiseType == SQUARES) scale = 1 / ((i + 1) * (i + 1));
			
			val += Noise.getNoise(i, baseAltitudeResolution * scale, spaceDimensions, coords) * scale;
		}
		
		val *= altitudeNoiseType;
		
		return Math.min(Math.max(val, 0), 1);
	}
	
	public double getWaterLevel(double x, double y) {
		return 0;
	}
	
	public double getLight(double x, double y, double time) {
		return 0;
	}
	
	public double getAverageLight(double x, double y) {
		return 0;
	}
	
	public double getAverageLight(double x, double y, double startTime, double endTime) {
		return 0;
	}
	
	public double getTemperature(double x, double y, double time) {
		return 0;
	}
	
	public double getAverageTemperature(double x, double y) {
		return 0;
	}
	
	public double getAverageTemperature(double x, double y, double startTime, double endTime) {
		return 0;
	}
	
	public double[] getFullCoords(double x, double y) {
		double[] coords = new double[3];
		
		double phi = x * Math.PI * 2;
		double theta = y * Math.PI * 2;
		
		coords[0] = Math.sin(phi) * (largeRadius + Math.cos(theta) * smallRadius) + largeRadius + smallRadius;
		coords[1] = Math.sin(theta) * smallRadius + smallRadius;
		coords[2] = Math.cos(phi) * (largeRadius + Math.cos(theta) * smallRadius) + largeRadius + smallRadius;
		
		return coords;
	}
	
	public double getX(double... coords) {
		return 0;
	}
	
	public double getY(double... coords) {
		return 0;
	}
	
	// Getters
	public double getLargeRadius() {return largeRadius;}
	public double getSmallRadius() {return smallRadius;}
	
	// Setters
	public void setLargeRadius(double R) {
		largeRadius = R;
		setSizeRatio();
	}
	
	public void setSmallRadius(double r) {
		smallRadius = r;
		setSizeRatio();
	}
	
	// Helpers
	protected void setSizeRatio() {
		sizeRatio = (largeRadius + smallRadius) / smallRadius;
	}
}